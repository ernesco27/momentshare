import PricingContainer from "@/components/PricingContainer";
import { getPlans } from "@/lib/actions/plan.action";

const PricingPage = async () => {
  const { data: plans, success, error } = await getPlans();

  console.log("plans:", plans);

  return (
    <>
      <PricingContainer plans={plans!} success={success} error={error!} />
    </>
  );
};

export default PricingPage;
