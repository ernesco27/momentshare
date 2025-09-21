"use server";

import mongoose from "mongoose";

import { Account, Event } from "@/database";
import { createEventParams, getEventsParams } from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import { createEventSchema, getEventsSchema } from "../validations";

export const createEvent = async (
  params: createEventParams
): Promise<ActionResponse<Event>> => {
  const validationResult = await action({
    params,
    schema: createEventSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    title,
    description,
    loc,
    coverImage,
    qrCode,
    eventUrl,
    startDate,
    expiryDate,
    maxUploadsPerAttendee,
  } = validationResult.params!;

  const userId = validationResult!.session!.user!.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingAccount = await Account.findOne({ userId }).session(session);

    if (!existingAccount) {
      throw new NotFoundError("Account");
    }

    // Pre-check based on account type
    if (existingAccount.accountType === "STANDARD") {
      if (existingAccount.eventCredits < 1) {
        throw new Error("Insufficient credits");
      }
    } else if (existingAccount.accountType === "PRO") {
      if (existingAccount.planDuration < 1) {
        throw new Error("Monthly subscription expired");
      }
    } else {
      throw new Error("Unsupported account type");
    }

    // Create event
    const [event] = await Event.create(
      [
        {
          organizer: existingAccount._id,
          title,
          description,
          loc,
          coverImage,
          qrCode,
          eventUrl,
          startDate,
          expiryDate,
          maxUploadsPerAttendee,
        },
      ],
      { session }
    );

    // Update account usage
    if (existingAccount.accountType === "STANDARD") {
      existingAccount.eventCredits -= 1;
    } else if (existingAccount.accountType === "PRO") {
      existingAccount.planDuration -= 1;
    }

    await existingAccount.save({ session });

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(event)),
      status: 201,
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
};

export const getEvents = async (
  params: getEventsParams
): Promise<ActionResponse<{ events: Event[]; isNext: boolean }>> => {
  const validationResult = await action({
    params,
    schema: getEventsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { page = 1, pageSize = 10, userId } = validationResult.params!;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const account = await Account.findOne({ userId });

    if (!account) {
      throw new NotFoundError("Account");
    }

    const totalEvents = await Event.countDocuments({ organizer: account._id });

    const events = await Event.find({ organizer: account._id })
      .populate("organizer")
      .skip(skip)
      .limit(limit)
      .sort({ startDate: -1 });

    const isNext = totalEvents > skip + events.length;

    return {
      success: true,
      data: {
        events: JSON.parse(JSON.stringify(events)),
        isNext,
      },
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
