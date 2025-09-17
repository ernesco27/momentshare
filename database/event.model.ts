import { model, models, Schema, Types } from "mongoose";

export interface IEvent {
  accountId: Types.ObjectId;
  title: string;
  description: string;
  loc?: string;
  coverImage?: string;
  status: "DRAFT" | "ACTIVE" | "ENDED";
  qrCode: string;
  eventUrl: string;
  startDate: Date;
  endDate?: Date;
  expiryDate: Date;
  maxUploadsPerAttendee: number;
}

export interface IEventDoc extends IEvent, Document {}

const EventSchema = new Schema<IEvent>(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    loc: { type: String },
    coverImage: { type: String },
    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "ENDED"],
      default: "DRAFT",
    },
    qrCode: { type: String, required: true, unique: true },
    eventUrl: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    expiryDate: { type: Date, required: true },
    maxUploadsPerAttendee: { type: Number, required: true },
  },
  { timestamps: true }
);

const Event = models?.Event || model<IEvent>("Event", EventSchema);

export default Event;
