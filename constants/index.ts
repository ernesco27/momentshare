export const navLinks = [
  { label: "Home", route: "/" },
  { label: "About Us", route: "/about-us" },
  { label: "Contact Us", route: "contact-us" },
  { label: "Pricing", route: "/pricing" },
];

export const dashNavLinks = [
  {
    imgURL: "/icons/home.svg",
    label: "Dashboard",
    route: "/dashboard",
  },
  {
    imgURL: "/icons/calendar.svg",
    label: "Events",
    route: "/events",
  },
  {
    imgURL: "/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
];

export const FEATURE = {
  MAX_UPLOADS: "MAX_UPLOADS",
  RETENTION_DAYS: "RETENTION_DAYS",
  PRIORITY_SUPPORT: "PRIORITY_SUPPORT",
  HD_UPLOADS: "HD_UPLOADS",
  CUSTOM_BRANDING: "CUSTOM_BRANDING",
  ANALYTICS: "ANALYTICS",
  STORAGE_LIMIT: "STORAGE_LIMIT",
  DOWNLOAD_ACCESS: "DOWNLOAD_ACCESS",
};

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
