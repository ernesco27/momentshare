import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Dashboard from "@/components/modules/dashboard/Dashboard";
import ROUTES from "@/constants/route";
import { getEvents } from "@/lib/actions/event.action";
import { getPlan } from "@/lib/actions/plan.action";
import { getUser } from "@/lib/actions/user.action";

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

  const [planResponse, eventResponse] = await Promise.all([
    getPlan({ planId: activePlan! }),
    getEvents({ userId: id! }),
  ]);

  const { name: planName } = planResponse.data!;
  const { success: eventSuccess, data, error: eventError } = eventResponse!;

  const events = data?.events || [];
  const totalMedia = data?.totalMedia || 0;
  const totalMaxUploads = data?.totalMaxUploads || 0;
  const totalEvents = data?.totalEvents || 0;
  const planFeatures = planResponse.data?.features || [];

  const isAnalyticsAllowed = user?.canAccessAnalytics || false;

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
