import { NextResponse } from "next/server";

import { Plan, User } from "@/database";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// Create User

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const validatedData = UserSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { email, username } = validatedData.data;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) throw new Error("User already exists");

    const freePlan = await Plan.findOne({ name: "FREE" });
    if (!freePlan) throw new NotFoundError("Free plan");

    const newUser = await User.create({
      ...validatedData.data,
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
      downloadQrFlyer: false,
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    handleError(error, "api") as APIErrorResponse;
  }
}
