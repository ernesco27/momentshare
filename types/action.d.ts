interface SignInWithOAuthParams {
  provider: "google" | "github";
  providerAccountId: string;
  user: {
    name: string;
    email: string;
    username: string;
    image: string;
  };
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}
interface getAccountParams {
  userId: string;
}

interface getPlansParams {
  planId: string;
}

interface IPlanWithFeatures extends IPlan {
  _id: string; // from Mongo
  features: IPlanFeature[];
}
interface createEventParams {
  title: string;
  description: string;
  loc: string;
  coverImage?: string;
  startDate: Date;
  expiryDate: Date;
  maxUploadsPerAttendee: number;
}

interface getEventsParams
  extends Omit<PaginatedSearchParams, "query" | "filter" | "sort"> {
  userId: string;
}

interface getEventParams {
  eventId: string;
}

interface ApiError {
  message: string;
  details?: Record<string, string[]>;
}
