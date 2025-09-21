import { model, models, Schema, Types } from "mongoose";

export interface IAccount {
  userId: Types.ObjectId;
  name: string;
  image?: string;
  password?: string;
  provider: string;
  providerAccountId: string;
  accountType: "STANDARD" | "PRO";
  activePlan: null;
  eventCredits?: number;
  planDuration?: number;
}

export interface IAccountDoc extends IAccount, Document {}

const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    image: { type: String },
    password: { type: String },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true, unique: true },
    accountType: {
      type: String,
      enum: ["STANDARD", "PRO"],
      default: "STANDARD",
    },
    activePlan: { type: Schema.Types.ObjectId, ref: "Plan" },
    eventCredits: { type: Number, default: 1 },
    planDuration: { type: Number },
  },
  { timestamps: true }
);

const Account = models?.Account || model<IAccount>("Account", AccountSchema);

export default Account;
