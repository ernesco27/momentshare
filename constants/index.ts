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
  MAX_ACTIVE_EVENTS: "MAX_ACTIVE_EVENTS",
  STORAGE_LIMIT_GB: "STORAGE_LIMIT_GB",
  CAN_REMOVE_WATERMARK: "CAN_REMOVE_WATERMARK",
  CAN_ACCESS_ANALYTICS: "CAN_ACCESS_ANALYTICS",
  MAX_UPLOADS: "MAX_UPLOADS",
  RETENTION_DAYS: "RETENTION_DAYS",
  PRIORITY_SUPPORT: "PRIORITY_SUPPORT",
  VIDEO_UPLOADS: "VIDEO_UPLOADS",
  RESELL_RIGHT: "RESELL_RIGHT",
  CUSTOM_BRANDING: "CUSTOM_BRANDING",
  DOWNLOAD_ACCESS: "DOWNLOAD_ACCESS",
  DOWNLOAD_QR_FLYER: "DOWNLOAD_QR_FLYER",
};

export const FEATURE_KEYS = [
  "MAX_ACTIVE_EVENTS",
  "STORAGE_LIMIT_GB",
  "CAN_REMOVE_WATERMARK",
  "CAN_ACCESS_ANALYTICS",
  "MAX_UPLOADS",
  "RETENTION_DAYS",
  "PRIORITY_SUPPORT",
  "VIDEO_UPLOADS",
  "RESELL_RIGHT",
  "CUSTOM_BRANDING",
  "DOWNLOAD_ACCESS",
  "DOWNLOAD_QR_FLYER",
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
