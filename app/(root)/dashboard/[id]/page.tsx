import Dashboard from "@/components/modules/dashboard/Dashboard";
import { getAccount } from "@/lib/actions/account.action";
import { getPlan } from "@/lib/actions/plan.action";
import { RouteParams } from "@/types/global";

const DashboardPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const { success, data: account, error } = await getAccount({ userId: id });

  const { name, accountType, activePlan, eventCredits } = account!;
  const {
    success: planSuccess,
    data: plan,
    error: planError,
  } = await getPlan({ planId: activePlan });

  const { name: planName, duration } = plan!;

  console.log("account!:", account);
  console.log("plan:", plan);

  return (
    <>
      <Dashboard
        name={name}
        accountType={accountType}
        planName={planName}
        duration={duration}
        eventCredits={eventCredits}
      />
    </>
  );
};

export default DashboardPage;
