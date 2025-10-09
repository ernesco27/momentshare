import PricingContainer from "@/components/PricingContainer";
import FeatureComparisonTable from "@/components/table/FeatureComparisonTable";
import { getPlans } from "@/lib/actions/plan.action";

const PricingPage = async () => {
  const { data: plans, success, error } = await getPlans();

  console.log("plans:", plans);

  return (
    <>
      <PricingContainer plans={plans!} success={success} error={error!} />
      <FeatureComparisonTable plans={plans!} popularPlan="STANDARD" />
    </>
  );
};

export default PricingPage;
