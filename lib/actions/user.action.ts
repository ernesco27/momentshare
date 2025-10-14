"use server";

import { cache } from "react";

import { User } from "@/database";
import { ActionResponse, ErrorResponse, GlobalUser } from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import { getUserSchema } from "../validations";

export const getUser = cache(async function getUser(
  params: getUserParams
): Promise<ActionResponse<GlobalUser>> {
  const validationResult = await action({ params, schema: getUserSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(user)),
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
});
