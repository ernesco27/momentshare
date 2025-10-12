import { auth } from "@/auth";
import PricingContainer from "@/components/PricingContainer";
import FeatureComparisonTable from "@/components/table/FeatureComparisonTable";
import { getPlans } from "@/lib/actions/plan.action";

const PricingPage = async () => {
  const session = await auth();

  const userId = session?.user?.id;

  const email = session?.user?.email;

  const { data: plans, success, error } = await getPlans();

  return (
    <>
      <PricingContainer
        plans={plans!}
        success={success}
        error={error!}
        userId={userId!}
        email={email!}
      />
      <FeatureComparisonTable plans={plans!} popularPlan="STANDARD" />
    </>
  );
};

export default PricingPage;
