import { model, models, Schema, Types } from "mongoose";

export interface IMedia {
  eventId: Types.ObjectId;
  fileType: string;
  fileUrl: string;
  publicId?: string;
}

export interface IMediaDoc extends IMedia, Document {}

const MediaSchema = new Schema<IMedia>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    fileType: { type: String, required: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String },
  },
  { timestamps: true }
);

const Media = models?.Media || model<IMedia>("Media", MediaSchema);

export default Media;
