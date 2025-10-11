"use server";

import mongoose from "mongoose";

import { Event, Media, User } from "@/database";
import { ActionResponse, ErrorResponse, GlobalMedia } from "@/types/global";

import cloudinary from "../cloudinary";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import { createMediaSchema, getEventMediaSchema } from "../validations";

export const createEventMedia = async (
  params: createEventMediaParams
): Promise<ActionResponse<GlobalMedia>> => {
  const validationResult = await action({ params, schema: createMediaSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { eventId, media, uploadedBy } = validationResult.params!;

  let event;
  let organizer;

  const uploadedPublicIds: string[] = [];
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    event = await Event.findById(eventId).session(session);
    if (!event) {
      throw new NotFoundError("Event");
    }

    organizer = await User.findById(event.organizer).session(session);
    if (!organizer) {
      throw new NotFoundError("Event organizer"); // Should not happen if data is consistent
    }

    // Always normalize to an array
    const mediaArray = Array.isArray(media) ? media : [media];

    if (mediaArray.length === 0) {
      throw new Error("No media provided for upload."); // Prevent empty array issues
    }

    const newMediaCount = mediaArray.length;
    const newStorageBytes = mediaArray.reduce(
      (sum, file) => sum + file.fileSizeBytes,
      0
    );

    if (
      event.maxUploads !== -1 &&
      event.totalMedia + newMediaCount > event.maxUploads
    ) {
      // Use -1 for unlimited
      throw new Error(
        `This event has reached its maximum upload limit of ${event.maxUploads} media items.`
      );
    }

    const userEventsStorage = await Event.aggregate([
      { $match: { organizer: organizer._id, status: { $ne: "deleted" } } }, // Sum up non-deleted events
      { $group: { _id: null, totalUsed: { $sum: "$storageUsedBytes" } } },
    ]).session(session);

    const currentUserStorageBytes =
      userEventsStorage.length > 0 ? userEventsStorage[0].totalUsed : 0;
    const userStorageLimitBytes = organizer.storageLimitGB * 1024 * 1024 * 1024; // Convert GB to Bytes

    if (
      userStorageLimitBytes !== -1 &&
      currentUserStorageBytes + newStorageBytes > userStorageLimitBytes
    ) {
      throw new Error(
        `You have exceeded your total storage limit of ${organizer.storageLimitGB} GB. Please upgrade your plan or delete some media.`
      );
    }

    // if (event.storageLimitBytes !== -1 && (event.storageUsedBytes + newStorageBytes) > event.storageLimitBytes) {
    //     throw new Error(`This event has exceeded its storage limit.`);
    // }

    const mediaDocs = await Media.create(
      mediaArray.map((file) => ({
        eventId,
        fileType: file.fileType,
        fileUrl: file.fileUrl,
        publicId: file.publicId,
        fileSizeBytes: file.fileSizeBytes,
        uploadedBy,
      })),
      { session, ordered: true }
    );

    await Event.findByIdAndUpdate(
      eventId,
      {
        $push: { media: { $each: mediaDocs.map((doc) => doc._id) } },
        $inc: {
          totalMedia: mediaDocs.length,
          storageUsedBytes: newStorageBytes,
        },
      },
      { session }
    );

    // Track uploaded public IDs for rollback
    uploadedPublicIds.push(
      ...(mediaArray.map((file) => file.publicId).filter(Boolean) as string[])
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(mediaDocs)),
      status: 201,
    };
  } catch (error) {
    await session.abortTransaction();

    if (uploadedPublicIds.length > 0) {
      await Promise.all(
        uploadedPublicIds.map((id) =>
          cloudinary.uploader.destroy(id).catch(() => null)
        )
      );
    }

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
};

export const getEventMedia = async (
  params: GetEventMediaParams
): Promise<
  ActionResponse<{
    media: GlobalMedia[];
    isNext: boolean;
    totalMedia: number;
  }>
> => {
  const validationResult = await action({
    params,
    schema: getEventMediaSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { eventId, page = 1, pageSize = 10 } = validationResult.params!;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const totalMedia = await Media.countDocuments({ eventId });

    const media = await Media.find({ eventId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const isNext = totalMedia > skip + media.length;

    return {
      success: true,
      data: {
        media: JSON.parse(JSON.stringify(media)),
        isNext,
        totalMedia,
      },
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
