import { model, models, Schema, Types } from "mongoose";

import { FEATURE_KEYS } from "@/constants";

export interface IPlanFeature {
  planId: Types.ObjectId;
  featureKey: (typeof FEATURE_KEYS)[number];
  enabled: boolean;
  limit?: number;
}

export interface IPlanFeatureDoc extends IPlanFeature, Document {}

const PlanFeatureSchema = new Schema<IPlanFeature>(
  {
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    featureKey: { type: String, required: true, enum: FEATURE_KEYS },
    enabled: { type: Boolean, default: false },
    limit: { type: Number },
  },
  { timestamps: true }
);

PlanFeatureSchema.index({ planId: 1, featureKey: 1 }, { unique: true });

PlanFeatureSchema.set("toJSON", { virtuals: true });
PlanFeatureSchema.set("toObject", { virtuals: true });

const PlanFeature =
  models?.PlanFeature || model<IPlanFeature>("PlanFeature", PlanFeatureSchema);

export default PlanFeature;
