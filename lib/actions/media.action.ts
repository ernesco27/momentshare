"use server";

import mongoose from "mongoose";

import { Event, Media } from "@/database";
import { ActionResponse, ErrorResponse, GlobalMedia } from "@/types/global";

import cloudinary from "../cloudinary";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { createMediaSchema, getEventMediaSchema } from "../validations";

export const createEventMedia = async (
  params: createEventMediaParams
): Promise<ActionResponse<GlobalMedia>> => {
  const validationResult = await action({ params, schema: createMediaSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { eventId, media } = validationResult.params!;

  const uploadedPublicIds: string[] = [];
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Always normalize to an array
    const mediaArray = Array.isArray(media) ? media : [media];

    const mediaDocs = await Media.create(
      mediaArray.map((file) => ({
        eventId,
        fileType: file.fileType,
        fileUrl: file.fileUrl,
        publicId: file.publicId,
      })),
      { session, ordered: true }
    );

    await Event.findByIdAndUpdate(
      eventId,
      {
        $push: { media: { $each: mediaDocs.map((doc) => doc._id) } },
        $inc: { totalMedia: mediaDocs.length },
      },
      { session }
    );

    // Track uploaded public IDs for rollback
    uploadedPublicIds.push(...mediaArray.map((file) => file.publicId));

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(mediaDocs)),
      status: 201,
    };
  } catch (error) {
    // Abort DB transaction
    await session.abortTransaction();
    session.endSession();

    // Rollback Cloudinary uploads
    if (uploadedPublicIds.length > 0) {
      await Promise.all(
        uploadedPublicIds.map((id) =>
          cloudinary.uploader.destroy(id).catch(() => null)
        )
      );
    }

    return handleError(error) as ErrorResponse;
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
