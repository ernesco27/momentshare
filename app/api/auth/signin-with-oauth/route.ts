import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";

import { Account, Plan, User } from "@/database";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { signInWithOAuthSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

export async function POST(request: Request) {
  const { provider, providerAccountId, user } = await request.json();

  await dbConnect();

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const validatedData = signInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const { name, username, email, image } = user;

    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    let existingUser = await User.findOne({ email }).session(session);

    const freePlan = await Plan.findOne({ name: "FREE" });
    if (!freePlan) throw new NotFoundError("Free plan");

    if (!existingUser) {
      [existingUser] = await User.create(
        [
          {
            name,
            username: slugifiedUsername,
            email,
            image,
            activePlan: freePlan._id,
            eventCredits: freePlan.credits || 0,
            tierActivationDate: new Date(),
            planHistory: [
              {
                planId: freePlan._id,
                activationDate: new Date(),
              },
            ],
            maxActiveEvents: freePlan.maxActiveEvents || 1,
            storageLimitGB: freePlan.storageLimitGB || 0.5,
            canRemoveWatermark: false,
            canAccessAnalytics: false,
            maxUploads: freePlan.maxUploads || 100,
            retentionDays: freePlan.retentionDays || 3,
            prioritySupport: false,
            videoUploads: false,
            resellRight: false,
            customBranding: false,
            downloadAccess: false,
          },
        ],
        { session }
      );
    } else {
      const updatedData: { name?: string; image?: string } = {};

      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          {
            _id: existingUser._id,
          },
          { $set: updatedData }
        ).session(session);
      }
    }

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    });

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    await session.endSession();
  }
}
