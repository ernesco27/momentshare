"use client";

import { EMPTY_PLAN } from "@/constants/states";
import { GlobalPlan } from "@/types/global";

import DataRenderer from "./DataRenderer";
import PriceSection from "./modules/home/PriceSection";

interface PricingContainerProps {
  plans: GlobalPlan[];
  success: boolean;
  error: ApiError;
  accountId?: string;
  email?: string;
}

const PricingContainer = ({
  plans,
  success,
  error,
  accountId,
  email,
}: PricingContainerProps) => {
  return (
    <>
      <DataRenderer
        data={plans}
        success={success}
        error={error}
        empty={EMPTY_PLAN}
        render={(plans) => (
          <PriceSection plans={plans} accountId={accountId} email={email} />
        )}
      />
    </>
  );
};

export default PricingContainer;
