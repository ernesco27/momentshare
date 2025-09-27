// lib/actions/generateUploadSignature.action.ts
"use server";

import crypto from "crypto";

export const generateUploadSignature = async (eventId: string) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = `MomentShare/events/${eventId}`;

  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
    .digest("hex");

  return {
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    folder,
  };
};
