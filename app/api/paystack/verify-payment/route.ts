import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { Plan, Transaction, User } from "@/database";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { applyPlanFeaturesToUser } from "@/lib/utils";
import { createTransactionSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

export async function POST(request: Request) {
  const requestBody = await request.json();

  const { reference, email, planId, userId } = requestBody;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await dbConnect();

    const validatedData = createTransactionSchema.safeParse({
      reference,
      email,
      planId,
      userId,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const plan = await Plan.findById(planId).session(session);
    if (!plan) throw new NotFoundError("Plan");

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

    // Call Paystack Verify API
    const verify = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!verify.ok) {
      // Log the actual error from Paystack for debugging
      const paystackError = await verify.json();
      console.error("Paystack verification failed:", paystackError);
      throw new Error(
        `Paystack verification failed: ${paystackError.message || verify.statusText}`
      );
    }

    const result = await verify.json();

    if (!result.status || result.data.status !== "success") {
      // Paystack indicates failure or non-success status
      throw new Error(
        `Paystack verification status: ${result.data.status || "unknown"}. Message: ${result.data.gateway_response || "No gateway response"}`
      );
    }

    const verifiedAmount = result.data.amount / 100;

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
          email: result.data.customer.email, // Use email from Paystack for verification
          planId: plan._id,
          amount: verifiedAmount,
          status: "FAILED",
          verifiedAt: new Date(),
          userId,
          paymentProviderTransactionId: result.data.id, // Store Paystack's transaction ID
        },
        { upsert: true, new: true, session }
      );
      return NextResponse.json(
        { success: false, message: "Transaction amount mismatch." },
        { status: 400 }
      );
    }

    const tx = await Transaction.findOneAndUpdate(
      { reference },
      {
        reference,
        email: result.data.customer.email, // Use Paystack's email, it's more authoritative
        planId: plan._id,
        amount: verifiedAmount, // Use Paystack's verified amount
        status: "SUCCESS",
        verifiedAt: new Date(),
        userId,
        paymentProviderTransactionId: result.data.id, // Store Paystack's transaction ID
      },
      { upsert: true, new: true, session }
    ).session(session);

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new NotFoundError("User not found for plan activation.");
    }

    const AddedCredits = plan.credits || 0;

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
      user.eventCredits += AddedCredits;
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

    return handleError(err, "api") as APIErrorResponse;
  } finally {
    await session.endSession();
  }
}
