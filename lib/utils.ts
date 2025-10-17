import { clsx, type ClassValue } from "clsx";
import { addMonths, differenceInDays, format } from "date-fns";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { Types } from "mongoose";
import mongoose from "mongoose";
import { twMerge } from "tailwind-merge";

import { FEATURE, IMAGE_FORMATS, VIDEO_FORMATS } from "@/constants";
import { Plan, PlanFeature } from "@/database";
import { GlobalMedia, GlobalPlan, GlobalUser } from "@/types/global";

import handleError from "./handlers/error";
import { NotFoundError } from "./http-errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

//utility function for the number days before an event expires which is calculated as the date the event is created + the number of days of the subscribed package

export function getEventExpiryDate(
  startDate: Date,
  retentionDays?: number
): Date {
  const expiry = new Date(startDate);
  expiry.setDate(expiry.getDate() + retentionDays!);
  return expiry;
}

export const engagementRate = (totalMedia: number, maxUploads: number) => {
  return (totalMedia / maxUploads) * 100;
};

export const AverageUploads = (totalMedia: number, totalEvents: number) => {
  return (totalMedia / totalEvents).toFixed(2);
};

export const getRecentMedia = (
  media: GlobalMedia[],
  limit = 12
): GlobalMedia[] => {
  if (!media || media.length === 0) return [];

  return media
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
};

export const getUploadsPerHour = (media: GlobalMedia[]) => {
  if (!media || media.length === 0) return [];

  const hourMap: Record<number, number> = {};

  media.forEach((m) => {
    const date = new Date(m.createdAt);
    const hour = date.getHours(); // 0–23
    hourMap[hour] = (hourMap[hour] || 0) + 1;
  });

  // Format into 12-hour labels for chart
  const ordered = Array.from({ length: 24 }, (_, hour) => {
    const label = `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`;
    return { hour: label, uploads: hourMap[hour] || 0 };
  });

  return ordered;
};

export const getMediaTypeStats = (media: GlobalMedia[]) => {
  const stats = { images: 0, videos: 0 };

  media.forEach((m) => {
    // if (m.fileType?.startsWith("jpg")) stats.images += 1;
    if (IMAGE_FORMATS.includes(m.fileType)) stats.images += 1;
    else if (VIDEO_FORMATS.includes(m.fileType)) stats.videos += 1;
  });

  return [
    { name: "Images", value: stats.images },
    { name: "Videos", value: stats.videos },
  ];
};

export const getVideoThumbnailUrl = (videoUrl: string, second: number = 2) => {
  try {
    const url = new URL(videoUrl);

    const [beforeUpload, afterUpload] = url.href.split("/upload/");
    if (!afterUpload) return videoUrl;

    const transformedUrl = `${beforeUpload}/upload/so_${second},f_jpg,q_auto/${afterUpload.replace(/\.[^/.]+$/, ".jpg")}`;

    return transformedUrl;
  } catch (error) {
    console.error("Invalid Cloudinary video URL:", videoUrl, error);
    return videoUrl;
  }
};

export const applyPlanFeaturesToUser = async (
  user: GlobalUser,
  planId: Types.ObjectId,
  session: mongoose.ClientSession
): Promise<GlobalUser> => {
  const plan = await Plan.findById(planId).session(session);

  if (!plan) {
    throw new NotFoundError("Plan");
  }

  const features = await PlanFeature.find({ planId }).session(session);

  user.maxActiveEvents = 1;
  user.storageLimitGB = 0.5;
  user.canRemoveWatermark = false;
  user.canAccessAnalytics = false;
  user.activePlan = plan._id;
  user.maxUploads = 100;
  user.retentionDays = 3;
  user.prioritySupport = false;
  user.videoUploads = false;
  user.resellerRight = false;
  user.customBranding = false;
  user.downloadAccess = false;
  user.downloadQrFlyer = false;

  features.forEach((feature) => {
    switch (feature.featureKey) {
      case FEATURE.MAX_ACTIVE_EVENTS:
        user.maxActiveEvents = feature.limit || 1; // Default to 1 if limit is null
        break;
      case FEATURE.STORAGE_LIMIT_GB:
        user.storageLimitGB = feature.limit || 0.5;
        break;
      case FEATURE.CAN_REMOVE_WATERMARK:
        user.canRemoveWatermark = feature.enabled;
        break;
      case FEATURE.CAN_ACCESS_ANALYTICS:
        user.canAccessAnalytics = feature.enabled;
        break;
      case FEATURE.MAX_UPLOADS:
        user.maxUploads = feature.limit || 100;
        break;
      case FEATURE.RETENTION_DAYS:
        user.retentionDays = feature.limit || 3;
        break;
      case FEATURE.PRIORITY_SUPPORT:
        user.prioritySupport = feature.enabled;
        break;
      case FEATURE.VIDEO_UPLOADS:
        user.videoUploads = feature.enabled;
        break;
      case FEATURE.RESELL_RIGHT:
        user.resellerRight = feature.enabled;
        break;
      case FEATURE.CUSTOM_BRANDING:
        user.customBranding = feature.enabled;
        break;
      case FEATURE.DOWNLOAD_ACCESS:
        user.downloadAccess = feature.enabled;
        break;

      case FEATURE.DOWNLOAD_QR_FLYER:
        user.downloadQrFlyer = feature.enabled;
        break;

      default:
        break;
    }
  });

  return user;
};

export const getExpiryDetails = (date?: string | Date) => {
  if (!date) return null;
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return null;

  const expiry = addMonths(parsed, 1);
  const daysLeft = differenceInDays(expiry, new Date());
  const totalDays = differenceInDays(expiry, parsed);
  const progress = Math.max(0, Math.min(100, (daysLeft / totalDays) * 100));

  return { expiryDate: format(expiry, "MMM dd, yyyy"), daysLeft, progress };
};

export const getFormattedDate = (date?: string | Date) => {
  if (!date) return "Not yet activated";
  const parsed = new Date(date);
  return isNaN(parsed.getTime())
    ? "Invalid date"
    : format(parsed, "MMM dd, yyyy");
};

export function isFeatureEnabledForPlan(
  plans: GlobalPlan[],
  planId: string,
  featureKey: string
): boolean {
  const plan = plans.find((p) => p._id === planId);
  if (!plan) return false;

  return plan.features.some(
    (feature) => feature.key === featureKey && feature.enabled
  );
}

export function bytesToGigabytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 MB";

  const mb = bytes / 1024 ** 2;
  const gb = bytes / 1024 ** 3;

  if (gb >= 1) {
    return `${gb.toFixed(decimals)} GB`;
  } else {
    return `${mb.toFixed(decimals)} MB`;
  }
}
