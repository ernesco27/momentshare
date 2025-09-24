"use server";

import { Plan } from "@/database";
import { ActionResponse, ErrorResponse } from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { getPlanSchema } from "../validations";

export const getPlan = async (
  params: getPlansParams
): Promise<ActionResponse<IPlanWithFeatures>> => {
  const validationResult = await action({ params, schema: getPlanSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { planId } = validationResult.params!;
  console.log("planId", planId);

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
