import { clsx, type ClassValue } from "clsx";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { twMerge } from "tailwind-merge";

import { IMAGE_FORMATS, VIDEO_FORMATS } from "@/constants";
import { GlobalMedia } from "@/types/global";

import handleError from "./handlers/error";

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

export const getVideoThumbnailUrl = (videoUrl: string, second: number = 0) => {
  try {
    const url = new URL(videoUrl);
    const parts = url.pathname.split("/upload/");
    if (parts.length !== 2) return videoUrl;

    return `${url.origin}${parts[0]}/upload/so_${second}/frame.jpg/${parts[1].replace(/\.[^/.]+$/, ".jpg")}`;
  } catch (error) {
    handleError(error);
    console.error("Invalid Cloudinary video URL:", videoUrl);
    return videoUrl;
  }
};
