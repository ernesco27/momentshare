import path from "path";

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { Plan, PlanFeature } from "@/database";

const plans = [
  {
    name: "FREE",
    description: "Try it out — ideal for testing or tiny gatherings.",
    priceNote: "Event",
    price: 0,
    currency: "GHS",
    type: "CREDIT",
    credits: 1,
    isFeatured: false,
  },
  {
    name: "STANDARD",
    description: "Most popular for birthdays & small weddings.",
    priceNote: "Event",
    price: 150,
    currency: "GHS",
    type: "CREDIT",
    credits: 1,
    isFeatured: true,
  },
  {
    name: "PREMIUM",
    description: "Recommended for weddings and medium events.",
    priceNote: "Event",
    price: 250,
    currency: "GHS",
    type: "CREDIT",
    credits: 1,
    isFeatured: false,
  },
  {
    name: "PRO",
    description: "For event planners, photographers & venues.",
    priceNote: "Month",
    price: 350,
    currency: "GHS",
    type: "SUBSCRIPTION",
    durationDays: 30,
    isFeatured: false,
  },
];

// Define feature sets per plan
const planFeatures: Record<
  string,
  { featureKey: string; enabled: boolean; limit?: number }[]
> = {
  FREE: [
    { featureKey: "MAX_ACTIVE_EVENTS", enabled: true, limit: 1 },
    { featureKey: "STORAGE_LIMIT_GB", enabled: true, limit: 0.5 }, // 500mb
    { featureKey: "CAN_REMOVE_WATERMARK", enabled: false },
    { featureKey: "CAN_ACCESS_ANALYTICS", enabled: false },
    { featureKey: "MAX_UPLOADS", enabled: true, limit: 100 },
    { featureKey: "RETENTION_DAYS", enabled: true, limit: 3 }, // 3 days
    { featureKey: "PRIORITY_SUPPORT", enabled: false },
    { featureKey: "VIDEO_UPLOADS", enabled: false },
    { featureKey: "RESELL_RIGHT", enabled: false },
    { featureKey: "CUSTOM_BRANDING", enabled: false },
    { featureKey: "DOWNLOAD_ACCESS", enabled: false },
  ],
  STANDARD: [
    { featureKey: "MAX_ACTIVE_EVENTS", enabled: true, limit: 3 },
    { featureKey: "STORAGE_LIMIT_GB", enabled: true, limit: 1 }, // 1GB
    { featureKey: "CAN_REMOVE_WATERMARK", enabled: true },
    { featureKey: "CAN_ACCESS_ANALYTICS", enabled: true },
    { featureKey: "MAX_UPLOADS", enabled: true, limit: 500 },
    { featureKey: "RETENTION_DAYS", enabled: true, limit: 7 }, // 7 days
    { featureKey: "PRIORITY_SUPPORT", enabled: false },
    { featureKey: "VIDEO_UPLOADS", enabled: false },
    { featureKey: "RESELL_RIGHT", enabled: false },
    { featureKey: "CUSTOM_BRANDING", enabled: false },
    { featureKey: "DOWNLOAD_ACCESS", enabled: true },
  ],
  PREMIUM: [
    { featureKey: "MAX_ACTIVE_EVENTS", enabled: true, limit: 5 },
    { featureKey: "STORAGE_LIMIT_GB", enabled: true, limit: 5 }, // 5GB
    { featureKey: "CAN_REMOVE_WATERMARK", enabled: true },
    { featureKey: "CAN_ACCESS_ANALYTICS", enabled: true },
    { featureKey: "MAX_UPLOADS", enabled: true, limit: 1000 },
    { featureKey: "RETENTION_DAYS", enabled: true, limit: 14 }, // 14 days
    { featureKey: "PRIORITY_SUPPORT", enabled: true },
    { featureKey: "VIDEO_UPLOADS", enabled: true },
    { featureKey: "RESELL_RIGHT", enabled: false },
    { featureKey: "CUSTOM_BRANDING", enabled: true },
    { featureKey: "DOWNLOAD_ACCESS", enabled: true },
  ],
  PRO: [
    { featureKey: "MAX_ACTIVE_EVENTS", enabled: true, limit: -1 }, //unlimited
    { featureKey: "STORAGE_LIMIT_GB", enabled: true, limit: 5 }, // 10GB
    { featureKey: "CAN_REMOVE_WATERMARK", enabled: true },
    { featureKey: "CAN_ACCESS_ANALYTICS", enabled: true },
    { featureKey: "MAX_UPLOADS", enabled: true, limit: -1 }, //unlimited
    { featureKey: "RETENTION_DAYS", enabled: true, limit: 14 }, // 30 days
    { featureKey: "PRIORITY_SUPPORT", enabled: true },
    { featureKey: "VIDEO_UPLOADS", enabled: true },
    { featureKey: "RESELL_RIGHT", enabled: true },
    { featureKey: "CUSTOM_BRANDING", enabled: true },
    { featureKey: "DOWNLOAD_ACCESS", enabled: true },
  ],
};

async function seed() {
  await mongoose.connect(process.env.MONGODB_SEED_URI!);

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
