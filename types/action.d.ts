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

export interface IPlanWithFeatures extends IPlan {
  _id: string; // from Mongo
  features: IPlanFeature[];
}
