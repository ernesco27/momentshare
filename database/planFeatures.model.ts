import { model, models, Schema, Types } from "mongoose";

export interface IPlanFeature {
  planId: Types.ObjectId;
  featureKey: string; // e.g. "HD_UPLOADS", "ANALYTICS", "CUSTOM_BRANDING"
  enabled: boolean;
  limit?: number; // optional, for capped features e.g. max uploads = 100
}

export interface IPlanFeatureDoc extends IPlanFeature, Document {}

const PlanFeatureSchema = new Schema<IPlanFeature>(
  {
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    featureKey: { type: String, required: true },
    enabled: { type: Boolean, default: false },
    limit: { type: Number }, // null/undefined means unlimited
  },
  { timestamps: true }
);

const PlanFeature =
  models?.PlanFeature || model<IPlanFeature>("PlanFeature", PlanFeatureSchema);

export default PlanFeature;
