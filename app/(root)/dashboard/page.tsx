import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Dashboard from "@/components/modules/dashboard/Dashboard";
import { FEATURE } from "@/constants";
import ROUTES from "@/constants/route";
import { getEvents } from "@/lib/actions/event.action";
import { getPlan, getPlans } from "@/lib/actions/plan.action";
import { getUser } from "@/lib/actions/user.action";
import { isFeatureEnabledForPlan } from "@/lib/utils";

const DashboardPage = async () => {
  const session = await auth();
  const id = session?.user?.id;

  if (!id) return redirect(ROUTES.SIGN_IN);

  const { data: user } = await getUser({ userId: id! });

  console.log("user", user);

  const {
    name,
    activePlan,
    eventCredits,
    isProSubscriber,
    proSubscriptionEndDate,
    tierActivationDate,
  } = user!;

  const [planResponse, eventResponse, plansResponse] = await Promise.all([
    getPlan({ planId: activePlan! }),
    getEvents({ userId: id! }),
    getPlans(),
  ]);

  const { name: planName } = planResponse.data!;
  const { success: eventSuccess, data, error: eventError } = eventResponse!;

  const plans = plansResponse.data;

  const events = data?.events || [];
  const totalMedia = data?.totalMedia || 0;
  const totalMaxUploads = data?.totalMaxUploads || 0;
  const totalEvents = data?.totalEvents || 0;
  const planFeatures = planResponse.data?.features || [];

  const isAnalyticsAllowed = isFeatureEnabledForPlan(
    plans!,
    activePlan!,
    FEATURE.CAN_ACCESS_ANALYTICS
  );

  return (
    <>
      <Dashboard
        name={name}
        planName={planName}
        eventCredits={eventCredits!}
        events={events!}
        EventError={eventError}
        EventSuccess={eventSuccess}
        planFeatures={planFeatures}
        id={id}
        totalMedia={totalMedia}
        totalMaxUploads={totalMaxUploads}
        totalEvents={totalEvents}
        isProSubscriber={isProSubscriber}
        proSubscriptionEndDate={proSubscriptionEndDate!}
        tierActivationDate={tierActivationDate}
        isAnalyticsAllowed={isAnalyticsAllowed}
      />
    </>
  );
};

export default DashboardPage;
