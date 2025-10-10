import { auth } from "@/auth";
import PricingContainer from "@/components/PricingContainer";
import FeatureComparisonTable from "@/components/table/FeatureComparisonTable";
import { getAccount } from "@/lib/actions/account.action";
import { getPlans } from "@/lib/actions/plan.action";

const PricingPage = async () => {
  const session = await auth();

  const userId = session?.user?.id;

  const email = session?.user?.email;

  const [plansResponse, accountResponse] = await Promise.all([
    getPlans(),
    getAccount({ userId: userId! }),
  ]);

  const { data: account } = accountResponse;

  const accountId = account?._id;

  const { data: plans, success, error } = plansResponse;

  return (
    <>
      <PricingContainer
        plans={plans!}
        success={success}
        error={error!}
        accountId={accountId!}
        email={email!}
      />
      <FeatureComparisonTable plans={plans!} popularPlan="STANDARD" />
    </>
  );
};

export default PricingPage;
