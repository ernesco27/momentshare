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
}

interface Account {
  _id: string;
  userId: string;
  name: string;
  image?: string;
  password?: string;
  provider: string;
  providerAccountId: string;
  accountType: string;
  activePlan?: string;
  eventCredits?: number;
  planExpiryDate?: Date;
}

interface Organizer {
  _id: string;
  name: string;
  image: string;
}

interface Event {
  title: string;
  description: string;
  organizer: Organizer;
  qrCode: string;
  startDate: Date;
  endDate: Date;
  expiryDate: Date;
  maxUploadsPerAttendee: number;
}
