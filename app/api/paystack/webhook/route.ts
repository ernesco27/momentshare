import crypto from "crypto";

import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { Plan, Transaction, User } from "@/database";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { applyPlanFeaturesToUser } from "@/lib/utils";

export async function POST(req: Request) {
  const rawBody = await req.text(); // read raw body (important!)
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  // Validate signature
  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  const signature = req.headers.get("x-paystack-signature");

  if (hash !== signature) {
    return NextResponse.json(
      { success: false, message: "Invalid signature" },
      { status: 401 }
    );
  }

  const event = JSON.parse(rawBody);
  if (event.event !== "charge.success") {
    return NextResponse.json(
      { success: true, message: "Ignored" },
      { status: 200 }
    );
  }

  const data = event.data;
  const { reference, amount, customer, metadata } = data;
  const { planId, userId } = metadata; // ensure you send these in Paystack initialize call

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await dbConnect();

    const plan = await Plan.findById(planId).session(session);
    if (!plan) throw new NotFoundError("Plan");

    const user = await User.findById(userId).session(session);
    if (!user) throw new NotFoundError("User");

    // Check if already processed
    const existingSuccessfulTx = await Transaction.findOne({
      reference,
      status: "SUCCESS",
    }).session(session);

    if (existingSuccessfulTx) {
      await session.abortTransaction();
      return NextResponse.json(
        {
          success: true,
          message: "Payment already successfully verified and processed.",
          data: existingSuccessfulTx,
        },
        { status: 200 }
      );
    }

    const verifiedAmount = amount / 100;

    if (Math.abs(plan.price - verifiedAmount) > 0.01) {
      // Log this discrepancy for investigation
      console.error(
        `Amount mismatch for reference ${reference}: Expected ${plan.price}, Got ${verifiedAmount}`
      );
      await session.abortTransaction();
      // Record transaction as FAILED due to amount mismatch
      await Transaction.findOneAndUpdate(
        { reference },
        {
          reference,
          email: customer.email,
          planId: plan._id,
          amount: verifiedAmount,
          status: "FAILED",
          verifiedAt: new Date(),
          userId,
          paymentProviderTransactionId: data.id,
        },
        { upsert: true, new: true, session }
      );
      return NextResponse.json(
        { success: false, message: "Transaction amount mismatch." },
        { status: 400 }
      );
    }

    // Save transaction
    const tx = await Transaction.findOneAndUpdate(
      { reference },
      {
        reference,
        email: customer.email,
        planId: plan._id,
        amount: verifiedAmount,
        status: "SUCCESS",
        verifiedAt: new Date(),
        userId,
        paymentProviderTransactionId: data.id,
      },
      { upsert: true, new: true, session }
    ).session(session);

    // --- Plan History and Transition Logic---
    // Update previous plan history entry
    if (user.planHistory.length > 0 && user.activePlanId) {
      const lastPlanEntry = user.planHistory[user.planHistory.length - 1];

      if (lastPlanEntry.planId.toString() === user.activePlanId.toString()) {
        lastPlanEntry.deactivationDate = new Date();
      }
    }

    // Add new plan entry to history
    user.planHistory.push({ planId: plan._id, activationDate: new Date() });
    user.activePlanId = plan._id;
    user.tierActivationDate = new Date();

    if (plan.type === "CREDIT") {
      user.isProSubscriber = false;
      user.proSubscriptionEndDate = undefined;
      user.eventCredits += plan.eventCredits || 0;
    } else {
      user.isProSubscriber = true;
      user.eventCredits = 0;
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (plan.durationDays || 30)); // Default to 30 days if not set
      user.proSubscriptionEndDate = endDate;
    }

    await applyPlanFeaturesToUser(user, plan._id, session);

    await user.save({ session });

    await session.commitTransaction();

    return NextResponse.json({ success: true, data: tx }, { status: 200 });
  } catch (err) {
    await session.abortTransaction();
    return handleError(err, "api");
  } finally {
    await session.endSession();
  }
}
