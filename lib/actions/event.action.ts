"use server";

import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import QRCode from "qrcode";
import { cache } from "react";

import { Event, Media, Plan, User } from "@/database";
import { IEventDoc } from "@/database/event.model";
import { ActionResponse, ErrorResponse, GlobalEvent } from "@/types/global";

import cloudinary from "../cloudinary";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { applyPlanFeaturesToUser } from "../utils";
import {
  createEventSchema,
  deleteEventSchema,
  editEventSchema,
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
    const existingUser = await User.findById(userId).session(session);

    if (!existingUser) {
      throw new NotFoundError("User");
    }

    const freePlan = await Plan.findOne({ name: "FREE" });
    if (!freePlan) throw new NotFoundError("Free plan");

    let userCanCreateEvent = false;

    if (existingUser.isProSubscriber) {
      if (
        !existingUser.proSubscriptionEndDate ||
        Date.now() > existingUser.proSubscriptionEndDate.getTime()
      ) {
        // Pro subscription has expired! Revert to Free plan.
        existingUser.isProSubscriber = false;
        existingUser.proSubscriptionEndDate = undefined; // Clear the expired date

        // Update current plan history - mark Pro as deactivated
        if (existingUser.planHistory.length > 0) {
          const lastPlanEntry =
            existingUser.planHistory[existingUser.planHistory.length - 1];
          if (
            lastPlanEntry.planId.toString() ===
            existingUser.activePlanId.toString()
          ) {
            lastPlanEntry.deactivationDate = new Date();
          }
        }

        await applyPlanFeaturesToUser(existingUser, freePlan._id, session);
        existingUser.eventCredits = freePlan.credits || 1;
        existingUser.tierActivationDate = new Date();
        existingUser.planHistory.push({
          planId: freePlan._id,
          activationDate: new Date(),
        });

        await existingUser.save({ session });

        console.warn(`User ${userId} Pro plan expired. Reverted to Free tier.`);
        throw new Error(
          "Your Pro plan expired, you've been reverted to Free. Please try again."
        );
      } else {
        userCanCreateEvent = true;
      }
    }

    if (!userCanCreateEvent) {
      if (existingUser.eventCredits < 1) {
        throw new Error(
          "You have no event credits left. Please upgrade your plan or purchase more credits to create new events."
        );
      }

      const activeEventsCount = await Event.countDocuments({
        organizer: existingUser._id,
        status: "active",
      }).session(session);

      if (
        existingUser.maxActiveEvents !== -1 &&
        activeEventsCount >= existingUser.maxActiveEvents
      ) {
        throw new Error(
          `You have reached your limit of ${existingUser.maxActiveEvents} active events. Please archive an existing event or upgrade your plan.`
        );
      }

      userCanCreateEvent = true;
    }

    const qrCode = nanoid(12);
    const eventUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/upload/${qrCode}`;
    const qrDataUrl = await QRCode.toDataURL(eventUrl);

    const uploadResponse = await cloudinary.uploader.upload(qrDataUrl, {
      folder: `MomentShare/qr_codes/${userId}`,
      public_id: qrCode,
      resource_type: "image",
      context: {
        userId: userId,
      },
    });

    if (!uploadResponse || !uploadResponse.secure_url) {
      throw new Error("Failed to upload QR code image.");
    }

    // Create event
    const [event] = await Event.create(
      [
        {
          organizer: existingUser._id,
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
          status: "active",
          storageUsedBytes: 0,
        },
      ],
      { session }
    );

    // Update user usage

    if (!existingUser.isProSubscriber) {
      await User.findByIdAndUpdate(
        userId,
        { $inc: { eventCredits: -1 } },
        { session, new: true }
      );
    }

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

export const getEvents = cache(async function getEvents(
  params: getEventsParams
): Promise<
  ActionResponse<{
    events: GlobalEvent[];
    isNext: boolean;
    totalMedia: number;
    totalMaxUploads: number;
    totalEvents: number;
  }>
> {
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
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User");
    }

    // Total events for pagination
    const totalEvents = await Event.countDocuments({ organizer: user._id });

    // Paginated events
    const events = await Event.find({ organizer: user._id })
      .populate("media")
      .skip(skip)
      .limit(limit)
      .sort({ startDate: -1 });

    const isNext = totalEvents > skip + events.length;

    // ✅ Get ALL event IDs for this organizer
    const allEventIds = await Event.find({ organizer: user._id }).distinct(
      "_id"
    );

    // ✅ Total media across ALL events (not just paginated ones)
    const totalMedia = await Media.countDocuments({
      eventId: { $in: allEventIds },
    });

    // ✅ Total maxUploads across all events (only for standard accounts)
    let totalMaxUploads = 0;
    if (!user.isProSubscriber) {
      const allEvents = await Event.find({ organizer: user._id }, "maxUploads");
      totalMaxUploads = allEvents.reduce(
        (sum, e) => sum + (e.maxUploads || 0),
        0
      );
    }

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
});

export const getEvent = cache(async function getEvent(
  params: getEventParams
): Promise<ActionResponse<GlobalEvent>> {
  const validationResult = await action({
    params,
    schema: getEventSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { eventId } = validationResult.params!;

  try {
    const event = await Event.findById(eventId).populate("media");

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
});

export const getEventByQR = cache(async function getEventByQR(
  params: getEventParamsQR
): Promise<ActionResponse<GlobalEvent>> {
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
});

export const deleteEvent = async (
  params: DeleteEventParams
): Promise<ActionResponse<GlobalEvent>> => {
  const validationResult = await action({
    params,
    schema: deleteEventSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { eventId } = validationResult.params!;
  const userId = validationResult!.session!.user!.id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new NotFoundError("User");
    }

    // 1. Fetch event + related media
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      throw new NotFoundError("Event");
    }

    if (event.organizer.toString() !== user._id.toString()) {
      throw new UnauthorizedError(
        "You are not authorized to delete this event"
      );
    }

    const mediaDocs = await Media.find({ eventId }).session(session);
    const qrCode = event.qrCode;

    // 2. Delete all media docs from DB
    await Media.deleteMany({ eventId: eventId }).session(session);

    // 3. Delete event itself
    await Event.deleteOne({ _id: eventId }).session(session);

    // 4. Commit DB transaction
    await session.commitTransaction();

    //  5. Cleanup Cloudinary asynchronously (outside of transaction)

    const eventFolder = `MomentShare/events/${eventId}`;
    const qrFolder = `MomentShare/qr_codes/${userId}`;
    if (mediaDocs.length > 0) {
      try {
        await cloudinary.api.delete_resources_by_prefix(eventFolder);

        await cloudinary.api.delete_folder(eventFolder);
      } catch (error) {
        return handleError(error) as ErrorResponse;
      }
    }

    //   Also delete QR code if exists
    if (qrCode) {
      try {
        await cloudinary.api.delete_resources_by_prefix(qrFolder);

        await cloudinary.api.delete_folder(qrFolder);
      } catch (error) {
        return handleError(error) as ErrorResponse;
      }
    }
    revalidatePath(`/events`);

    return {
      success: true,

      status: 200,
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
};

export const editEvent = cache(async function editEvent(
  params: EditEventParams
): Promise<ActionResponse<IEventDoc>> {
  const validationResult = await action({
    params,
    schema: editEventSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, description, loc, coverImage, themeColor, eventId } =
    validationResult.params!;

  const userId = validationResult!.session!.user!.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new NotFoundError("User");
    }

    const event = await Event.findById(eventId).session(session);

    if (!event) {
      throw new NotFoundError("Event");
    }

    if (event.organizer._id.toString() !== user._id.toString()) {
      throw new UnauthorizedError("You are not authorized to edit this event.");
    }

    if (
      event.title !== title ||
      event.description !== description ||
      event.loc !== loc ||
      event.coverImage !== coverImage ||
      event.themeColor !== themeColor
    ) {
      event.title = title;
      event.description = description;
      event.loc = loc;
      event.coverImage = coverImage;
      event.themeColor = themeColor;

      await event.save({ session });
    }

    await session.commitTransaction();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(event)),
      status: 200,
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
});
