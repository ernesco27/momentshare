"use server";

import { Account } from "@/database";
import { ActionResponse, ErrorResponse, GlobalAccount } from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { getAccountSchema } from "../validations";

export const getAccount = async (
  params: getAccountParams
): Promise<ActionResponse<GlobalAccount>> => {
  const validationResult = await action({ params, schema: getAccountSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    const account = await Account.findOne({ userId });

    if (!account) {
      throw new Error("Account not found");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(account)),
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
