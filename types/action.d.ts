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

interface getUserParams {
  userId: string;
}

interface getPlansParams {
  planId: string;
}

interface IPlanWithFeatures extends IPlan {
  _id: string;
  name: string;
  features: IPlanFeature[];
}
interface createEventParams {
  title: string;
  description: string;
  loc: string;
  coverImage?: string;
  startDate: Date;
  expiryDate: Date;
  maxUploads: number;
  themeColor: string;
  storageLimit: number;
}

interface getEventsParams
  extends Omit<PaginatedSearchParams, "query" | "filter" | "sort"> {
  userId: string;
}

interface getEventParams {
  eventId: string;
}

interface getEventParamsQR {
  qrCode: string;
}

interface ApiError {
  message: string;
  details?: Record<string, string[]>;
}

interface createEventMediaParams {
  eventId: string;

  media: {
    fileUrl: string;
    fileType: string;
    publicId: string;
    fileSizeBytes: number;
    uploadedBy?: string;
  }[];
}

interface GetEventMediaParams
  extends Omit<PaginatedSearchParams, "query" | "filter" | "sort"> {
  eventId: string;
}

interface EditEventParams
  extends Omit<
    createEventParams,
    "maxUploads" | "expiryDate" | "startDate" | "storageLimit"
  > {
  eventId: string;
}

interface DeleteEventParams {
  eventId: string;
}
