"use server";

import { Plan } from "@/database";
import { IPlanDoc } from "@/database/plan.model";
import { IPlanFeatureDoc } from "@/database/planFeatures.model";
import { ActionResponse, ErrorResponse, GlobalPlan } from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import dbConnect from "../mongoose";
import { getPlanSchema } from "../validations";

export const getPlan = async (
  params: getPlansParams
): Promise<ActionResponse<IPlanWithFeatures>> => {
  const validationResult = await action({ params, schema: getPlanSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { planId } = validationResult.params!;

  try {
    const plan = await Plan.findById(planId).populate("features");

    if (!plan) {
      throw new Error("Plan not found");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(plan)),
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getPlans = async (): Promise<ActionResponse<GlobalPlan[]>> => {
  try {
    await dbConnect();
    const plans = await Plan.find()
      .populate("features")
      .sort({ price: 1 })
      .lean();

    if (!plans) throw new NotFoundError("plans");

    const formattedPlans = plans.map((plan) => ({
      _id: plan._id,
      name: plan.name,
      price: plan.price,
      description: plan.description,
      priceNote: plan.priceNote ?? null,
      isFeatured: plan.isFeatured ?? false,
      currency: plan.currency,
      type: plan.type,
      credits: plan.credits ?? null,
      durationDays: plan.durationDays ?? null,
      features:
        plan.features?.map((f: IPlanFeatureDoc) => ({
          key: f.featureKey,
          enabled: f.enabled,
          limit: f.limit ?? null,
        })) ?? [],
    }));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(formattedPlans)),
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
