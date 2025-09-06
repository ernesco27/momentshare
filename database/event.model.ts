import { model, models, Schema, Types } from "mongoose";

export interface IEvent {
  title: string;
  description: string;
  organizer: Types.ObjectId;
  qrCode: string;
  startDate: Date;
  endDate: Date;
  expiryDate: Date;
  mediaExpiryDays: number;
  maxUploadsPerAttendee: number;
}

export interface IEventDoc extends IEvent, Document {}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    qrCode: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    mediaExpiryDays: { type: Number, required: true },
    maxUploadsPerAttendee: { type: Number, required: true },
  },
  { timestamps: true }
);

const Event = models?.Event || model<IEvent>("Event", EventSchema);

export default Event;
