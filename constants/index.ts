import ROUTES from "./route";

export const navLinks = [
  { label: "Home", route: ROUTES.HOME },
  { label: "About Us", route: "/about-us" },
  { label: "Contact Us", route: "contact-us" },
  { label: "Pricing", route: ROUTES.PRICING },
];

export const dashNavLinks = [
  {
    imgURL: "/icons/home.svg",
    label: "Dashboard",
    route: ROUTES.DASHBOARD,
  },
  {
    imgURL: "/icons/calendar.svg",
    label: "Events",
    route: "/dashboard/events",
  },
  {
    imgURL: "/icons/user.svg",
    route: "/dashboard/profile",
    label: "Profile",
  },
];

export const FEATURE = {
  MAX_UPLOADS: "MAX_UPLOADS",
  RETENTION_DAYS: "RETENTION_DAYS",
  PRIORITY_SUPPORT: "PRIORITY_SUPPORT",
  VIDEO_UPLOADS: "VIDEO_UPLOADS",
  MAX_EVENTS: "MAX_EVENTS",
  RESELL_RIGHT: "RESELL_RIGHT",
  CUSTOM_BRANDING: "CUSTOM_BRANDING",
  ANALYTICS: "ANALYTICS",
  STORAGE_LIMIT_GB: "STORAGE_LIMIT_GB",
  DOWNLOAD_ACCESS: "DOWNLOAD_ACCESS",
};

export const FEATURE_KEYS = [
  "VIDEO_UPLOADS",
  "ANALYTICS",
  "CUSTOM_BRANDING",
  "MAX_UPLOADS",
  "STORAGE_LIMIT_GB",
  "RETENTION_DAYS",
  "DOWNLOAD_ACCESS",
  "PRIORITY_SUPPORT",
  "MAX_EVENTS",
  "RESELL_RIGHT",
];

// images
export const IMAGE_FORMATS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "tiff",
  "webp",
  "svg",
];

// videos
export const VIDEO_FORMATS = ["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv"];

// merge for allowed formats
export const ALLOWED_FORMATS = [...IMAGE_FORMATS, ...VIDEO_FORMATS];
