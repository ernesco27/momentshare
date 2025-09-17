import { model, models, Schema, Types } from "mongoose";

export interface IMedia {
  event: Types.ObjectId;
  fileType: string;
  fileUrl: string;
}

export interface IMediaDoc extends IMedia, Document {}

const MediaSchema = new Schema<IMedia>(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    fileType: { type: String, required: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Media = models?.Media || model<IMedia>("Media", MediaSchema);

export default Media;
