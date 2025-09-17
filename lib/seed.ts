import mongoose from "mongoose";

import { Plan, PlanFeature } from "@/database";

const plans = [
  {
    name: "FREE",
    price: 0,
    currency: "GHS",
    type: "CREDIT",
    credits: 1,
  },
  {
    name: "STANDARD",
    price: 150,
    currency: "GHS",
    type: "CREDIT",
    credits: 1,
  },
  {
    name: "PREMIUM",
    price: 250,
    currency: "GHS",
    type: "CREDIT",
    credits: 1,
  },
  {
    name: "PRO",
    price: 350,
    currency: "GHS",
    type: "SUBSCRIPTION",
    durationDays: 30,
  },
];

// Define feature sets per plan
const planFeatures: Record<
  string,
  { featureKey: string; enabled: boolean; limit?: number }[]
> = {
  FREE: [
    { featureKey: "HD_UPLOADS", enabled: false },
    { featureKey: "CUSTOM_BRANDING", enabled: false },
    { featureKey: "ANALYTICS", enabled: false },
    { featureKey: "MAX_UPLOADS", enabled: true, limit: 100 },
  ],
  STANDARD: [
    { featureKey: "HD_UPLOADS", enabled: true },
    { featureKey: "CUSTOM_BRANDING", enabled: false },
    { featureKey: "ANALYTICS", enabled: false },
    { featureKey: "MAX_UPLOADS", enabled: true, limit: 500 },
  ],
  PREMIUM: [
    { featureKey: "HD_UPLOADS", enabled: true },
    { featureKey: "CUSTOM_BRANDING", enabled: true },
    { featureKey: "ANALYTICS", enabled: false },
    { featureKey: "MAX_UPLOADS", enabled: true, limit: 2000 },
  ],
  PRO: [
    { featureKey: "HD_UPLOADS", enabled: true },
    { featureKey: "CUSTOM_BRANDING", enabled: true },
    { featureKey: "ANALYTICS", enabled: true },
    { featureKey: "MAX_UPLOADS", enabled: true }, // unlimited
  ],
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI!);

  // Clear existing data
  await Plan.deleteMany({});
  await PlanFeature.deleteMany({});

  // Insert plans
  const createdPlans = await Plan.insertMany(plans);

  // Insert features linked to plans
  for (const plan of createdPlans) {
    const features = planFeatures[plan.name];
    const featuresWithPlanId = features.map((f) => ({
      ...f,
      planId: plan._id,
    }));
    await PlanFeature.insertMany(featuresWithPlanId);
  }

  console.log("✅ Plans and features seeded successfully");
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
