import { NextResponse } from "next/server";

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface User {
  _id: string;
  name: string;
  username: string;
  image?: string;
  email: string;
  activePlan: string;
  eventCredits: number;
  isProSubscriber: boolean;
  proSubscriptionEndDate?: Date;
  planHistory: {
    planId: string;
    activationDate: Date;
    deactivationDate?: Date;
  }[];
  maxActiveEvents: number;
  storageLimitGB: number;
  canRemoveWatermark: boolean;
  canAccessAnalytics: boolean;
  maxUploads: number;
  retentionDays: number;
  prioritySupport: boolean;
  videoUploads: boolean;
  resellerRight: boolean;
  customBranding: boolean;
  downloadAccess: boolean;
}

interface GlobalAccount {
  _id: string;
  userId: string;
  name: string;
  image?: string;
  password?: string;
  provider: string;
  providerAccountId: string;
}

interface GlobalMedia {
  _id: string;
  eventId: string;
  fileType: string;
  fileUrl: string;
  publicId?: string;
}

interface GlobalEvent {
  _id: string;
  title: string;
  description: string;
  loc: string;
  coverImage?: string;
  organizer: Account;
  qrCode: string;
  qrImage: string;
  eventUrl: string;
  startDate: Date;
  expiryDate: Date;
  maxUploads: number;
  themeColor: string;
  media: GlobalMedia[];
  totalMedia?: number;
  status: string;
  storageUsedBytes: number;
}

interface GlobalPlan {
  _id: string;
  name: string;
  description: string;
  priceNote?: string;
  price: number;
  currency: string;
  type: string;
  credits?: number;
  durationDays?: number;
  features: PlanFeature[];
  isFeatured?: boolean;
}

interface PlanFeature {
  key: string;
  enabled: boolean;
  limit?: number;
}
