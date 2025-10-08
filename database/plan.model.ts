import { model, models, Schema } from "mongoose";

export interface IPlan {
  name: "FREE" | "STANDARD" | "PREMIUM" | "PRO";
  description: string;
  priceNote?: string;
  price: number;
  currency: "GHS";
  type: "CREDIT" | "SUBSCRIPTION";
  credits?: number;
  durationDays?: number;
  isFeatured?: boolean;
}

export interface IPlanDoc extends IPlan, Document {}

const PlanSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      enum: ["FREE", "STANDARD", "PREMIUM", "PRO"],
      required: true,
      unique: true,
    },
    description: { type: String, required: true },
    priceNote: { type: String },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ["GHS"], required: true },
    type: { type: String, enum: ["CREDIT", "SUBSCRIPTION"], required: true },
    credits: {
      type: Number,
      validate: {
        validator: function (v: number) {
          return this.type === "CREDIT" ? v > 0 : true;
        },
        message: "Credits must be > 0 for CREDIT plans",
      },
    },
    durationDays: {
      type: Number,
      validate: {
        validator: function (v: number) {
          return this.type === "SUBSCRIPTION" ? v > 0 : true;
        },
        message: "durationDays must be > 0 for SUBSCRIPTION plans",
      },
    },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PlanSchema.virtual("features", {
  ref: "PlanFeature",
  localField: "_id",
  foreignField: "planId",
});

PlanSchema.set("toObject", { virtuals: true });
PlanSchema.set("toJSON", { virtuals: true });

const Plan = models?.Plan || model<IPlan>("Plan", PlanSchema);

export default Plan;
