import { model, models, Schema, Types } from "mongoose";

export interface IEvent {
  organizer: Types.ObjectId;
  title: string;
  description: string;
  loc: string;
  coverImage?: string;
  logo?: string;
  qrCode: string;
  qrImage: string;
  qrPublicId: string;
  eventUrl: string;
  startDate: Date;
  expiryDate: Date;
  maxUploads: number;
  themeColor: string;
  media?: Types.ObjectId[];
  totalMedia: number;
  status: "active" | "archived" | "completed" | "deleted";
  storageUsedBytes: number;
  storageLimit: number;
}

export interface IEventDoc extends IEvent, Document {}

const EventSchema = new Schema<IEvent>(
  {
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    loc: { type: String, required: true },
    coverImage: { type: String },
    logo: { type: String },
    qrCode: { type: String, required: true, unique: true },
    qrImage: { type: String, required: true },
    qrPublicId: { type: String, required: true, unique: true },
    eventUrl: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    maxUploads: { type: Number, required: true },
    themeColor: { type: String, required: true },
    media: [{ type: Schema.Types.ObjectId, ref: "Media" }],
    totalMedia: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "archived", "completed", "deleted"],
      default: "active",
      required: true,
    },
    storageUsedBytes: { type: Number, default: 0, required: true },
    storageLimit: { type: Number, default: 0.5, required: true },
  },
  { timestamps: true }
);

const Event = models?.Event || model<IEvent>("Event", EventSchema);

export default Event;
