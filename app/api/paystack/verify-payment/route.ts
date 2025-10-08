import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { Account, Plan, Transaction } from "@/database";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { createTransactionSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

export async function POST(request: Request) {
  const { reference, email, planId, amount, accountId } = await request.json();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await dbConnect();

    const validatedData = createTransactionSchema.safeParse({
      reference,
      email,
      planId,
      amount,
      accountId,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    // Call Paystack Verify API
    const verify = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const result = await verify.json();

    const plan = await Plan.findById(planId).session(session);
    if (!plan) throw new NotFoundError("Plan");

    const verifiedAmount = result.data.amount / 100;

    if (Math.abs(plan.price - verifiedAmount) > 0.01) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, message: "Amount mismatch" },
        { status: 400 }
      );
    }

    if (
      result.status &&
      result.data.status === "success" &&
      plan.price === verifiedAmount
    ) {
      // Save transaction if verified
      const tx = await Transaction.findOneAndUpdate(
        { reference },
        {
          reference,
          email,
          planId,
          amount,
          status: "SUCCESS",
          verifiedAt: new Date(),
          accountId,
        },
        { upsert: true, new: true }
      ).session(session);

      const account = await Account.findById(accountId).session(session);
      if (!account) throw new NotFoundError("Account");

      if (plan.type === "CREDIT") {
        account.eventCredits += plan.credits;
        account.activePlan = planId;

        await account.save({ session });
      } else {
        account.planDuration += plan.durationDays;
        account.activePlan = planId;
        account.accountType = "PRO";

        await account.save({ session });
      }
      await session.commitTransaction();

      return NextResponse.json({ success: true, data: tx }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (err) {
    await session.abortTransaction();
    return handleError(err, "api") as APIErrorResponse;
  } finally {
    await session.endSession();
  }
}
