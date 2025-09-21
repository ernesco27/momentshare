import { model, models, Schema, Types } from "mongoose";

export interface IEvent {
  organizer: Types.ObjectId;
  title: string;
  description: string;
  loc?: string;
  coverImage?: string;
  qrCode: string;
  eventUrl: string;
  startDate: Date;
  expiryDate: Date;
  maxUploadsPerAttendee: number;
}

export interface IEventDoc extends IEvent, Document {}

const EventSchema = new Schema<IEvent>(
  {
    organizer: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    loc: { type: String },
    coverImage: { type: String },
    qrCode: { type: String, required: true, unique: true },
    eventUrl: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    maxUploadsPerAttendee: { type: Number, required: true },
  },
  { timestamps: true }
);

const Event = models?.Event || model<IEvent>("Event", EventSchema);

export default Event;
