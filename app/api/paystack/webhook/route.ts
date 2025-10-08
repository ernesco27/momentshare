import crypto from "crypto";

import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { Account, Plan, Transaction } from "@/database";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";

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
  const { planId, accountId } = metadata; // ensure you send these in Paystack initialize call

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await dbConnect();

    const plan = await Plan.findById(planId).session(session);
    if (!plan) throw new NotFoundError("Plan");

    const account = await Account.findById(accountId).session(session);
    if (!account) throw new NotFoundError("Account");

    // Check if already processed
    const existingTx = await Transaction.findOne({ reference }).session(
      session
    );
    if (existingTx?.status === "SUCCESS") {
      await session.abortTransaction();
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const verifiedAmount = amount / 100;
    if (Math.abs(plan.price - verifiedAmount) > 0.01) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, message: "Amount mismatch" },
        { status: 400 }
      );
    }

    // Save transaction
    const tx = await Transaction.findOneAndUpdate(
      { reference },
      {
        reference,
        email: customer.email,
        planId,
        amount: verifiedAmount,
        status: "SUCCESS",
        verifiedAt: new Date(),
        accountId,
      },
      { upsert: true, new: true }
    ).session(session);

    // Update account
    if (plan.type === "CREDIT") {
      account.eventCredits += plan.credits;
      account.activePlan = planId;
    } else {
      account.planDuration += plan.durationDays;
      account.activePlan = planId;
      account.accountType = "PRO";
    }
    account.activePlan = planId;
    await account.save({ session });

    await session.commitTransaction();

    return NextResponse.json({ success: true, data: tx }, { status: 200 });
  } catch (err) {
    await session.abortTransaction();
    return handleError(err, "api");
  } finally {
    await session.endSession();
  }
}
