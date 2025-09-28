"use server";

import mongoose from "mongoose";
import { nanoid } from "nanoid";
import QRCode from "qrcode";

import { Account, Event, Media } from "@/database";
import { ActionResponse, ErrorResponse, GlobalEvent } from "@/types/global";

import cloudinary from "../cloudinary";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import {
  createEventSchema,
  getEventSchema,
  getEventSchemaQR,
  getEventsSchema,
} from "../validations";

export const createEvent = async (
  params: createEventParams
): Promise<ActionResponse<GlobalEvent>> => {
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
    startDate,
    expiryDate,
    maxUploads,
    themeColor,
  } = validationResult.params!;

  const userId = validationResult!.session!.user!.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingAccount = await Account.findOne({ userId }).session(session);

    if (!existingAccount) {
      throw new NotFoundError("Account");
    }

    const qrCode = nanoid(12);
    const eventUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/events/upload/${qrCode}`;
    const qrDataUrl = await QRCode.toDataURL(eventUrl);

    const uploadResponse = await cloudinary.uploader.upload(qrDataUrl, {
      folder: `MomentShare/qr_codes/${userId}`, // each user has their own folder
      public_id: qrCode,
      resource_type: "image",
      context: {
        userId: userId,
        accountId: existingAccount._id.toString(),
      },
    });

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
          qrImage: uploadResponse.secure_url,
          qrPublicId: uploadResponse.public_id,
          eventUrl,
          startDate,
          expiryDate,
          maxUploads,
          themeColor,
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
): Promise<
  ActionResponse<{
    events: GlobalEvent[];
    isNext: boolean;
    totalMedia: number;
    totalMaxUploads: number;
    totalEvents: number;
  }>
> => {
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

    // Total events for pagination
    const totalEvents = await Event.countDocuments({ organizer: account._id });

    // Paginated events
    const events = await Event.find({ organizer: account._id })
      .populate("media")
      .skip(skip)
      .limit(limit)
      .sort({ startDate: -1 });

    const isNext = totalEvents > skip + events.length;

    // ✅ Get ALL event IDs for this organizer
    const allEventIds = await Event.find({ organizer: account._id }).distinct(
      "_id"
    );

    // ✅ Total media across ALL events (not just paginated ones)
    const totalMedia = await Media.countDocuments({
      eventId: { $in: allEventIds },
    });

    // ✅ Total maxUploads across all events (only for standard accounts)
    let totalMaxUploads = 0;
    if (account.accountType !== "PRO") {
      const allEvents = await Event.find(
        { organizer: account._id },
        "maxUploads"
      );
      totalMaxUploads = allEvents.reduce(
        (sum, e) => sum + (e.maxUploads || 0),
        0
      );
    }

    console.log("totalEvents", totalEvents);

    return {
      success: true,
      data: {
        events: JSON.parse(JSON.stringify(events)),
        isNext,
        totalMedia,
        totalMaxUploads,
        totalEvents,
      },
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getEvent = async (
  params: getEventParams
): Promise<ActionResponse<GlobalEvent>> => {
  const validationResult = await action({
    params,
    schema: getEventSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { eventId } = validationResult.params!;

  try {
    const event = await Event.findById(eventId)
      .populate("organizer")
      .populate("media");

    if (!event) {
      throw new NotFoundError("Event");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(event)),
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getEventByQR = async (
  params: getEventParamsQR
): Promise<ActionResponse<GlobalEvent>> => {
  const validationResult = await action({
    params,
    schema: getEventSchemaQR,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { qrCode } = validationResult.params!;

  try {
    const event = await Event.findOne({ qrCode }).populate("organizer");

    if (!event) {
      throw new NotFoundError("Event");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(event)),
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const deleteEvent = async (
  eventId: string
): Promise<ActionResponse<null>> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Fetch event + related media
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      throw new Error("Event not found");
    }

    const mediaDocs = await Media.find({ eventId }).session(session);

    // 2. Delete all media docs from DB
    await Media.deleteMany({ eventId }).session(session);

    // 3. Delete event itself
    await Event.deleteOne({ _id: eventId }).session(session);

    // 4. Commit DB transaction
    await session.commitTransaction();
    session.endSession();

    // 5. Cleanup Cloudinary asynchronously (outside of transaction)
    if (mediaDocs.length > 0) {
      await Promise.all(
        mediaDocs.map(
          (m) =>
            cloudinary.uploader
              .destroy(m.publicId, {
                resource_type: "auto",
              })
              .catch(() => null) // ignore failures
        )
      );
    }

    // Also delete QR code if exists
    if (event.qrCode) {
      await cloudinary.uploader
        .destroy(`MomentShare/qr_codes/${event.qrCode}`)
        .catch(() => null);
    }

    return {
      success: true,
      data: null,
      status: 200,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(error) as ErrorResponse;
  }
};
