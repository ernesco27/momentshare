import { model, models, Schema, Types } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  image?: string;
  activePlan: Types.ObjectId;
  eventCredits: number;
  isProSubscriber: boolean;
  proSubscriptionEndDate?: Date;
  tierActivationDate: Date;
  planHistory: {
    planId: Types.ObjectId;
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

export interface IUserDoc extends IUser, Document {}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    activePlan: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    eventCredits: { type: Number, default: 0, required: true },
    isProSubscriber: { type: Boolean, default: false, required: true },
    proSubscriptionEndDate: { type: Date },
    planHistory: [
      {
        planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
        activationDate: { type: Date, default: Date.now, required: true },
        deactivationDate: { type: Date },
      },
    ],
    maxActiveEvents: { type: Number, default: 1, required: true },
    storageLimitGB: { type: Number, default: 0.5, required: true },
    canRemoveWatermark: { type: Boolean, default: false, required: true },
    canAccessAnalytics: { type: Boolean, default: false, required: true },
    maxUploads: { type: Number, default: 100, required: true },
    retentionDays: { type: Number, default: 3, required: true },
    prioritySupport: { type: Boolean, default: false, required: true },
    videoUploads: { type: Boolean, default: false, required: true },
    resellerRight: { type: Boolean, default: false, required: true },
    customBranding: { type: Boolean, default: false, required: true },
    downloadAccess: { type: Boolean, default: false, required: true },
  },

  { timestamps: true }
);

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
