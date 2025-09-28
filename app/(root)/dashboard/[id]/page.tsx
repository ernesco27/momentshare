import Dashboard from "@/components/modules/dashboard/Dashboard";
import { getAccount } from "@/lib/actions/account.action";
import { getEvents } from "@/lib/actions/event.action";
import { getPlan } from "@/lib/actions/plan.action";
import { RouteParams } from "@/types/global";

const DashboardPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const { data: account } = await getAccount({ userId: id });

  const { name, accountType, activePlan, eventCredits, planDuration } =
    account!;

  const [planResponse, eventResponse] = await Promise.all([
    getPlan({ planId: activePlan! }),
    getEvents({ userId: id }),
  ]);

  const { name: planName } = planResponse.data!;
  const { success: eventSuccess, data, error: eventError } = eventResponse!;

  const events = data?.events || [];
  const totalMedia = data?.totalMedia || 0;
  const totalMaxUploads = data?.totalMaxUploads || 0;
  const totalEvents = data?.totalEvents || 0;
  const planFeatures = planResponse.data?.features || [];

  console.log("events:", events);

  return (
    <>
      <Dashboard
        name={name}
        accountType={accountType}
        planName={planName}
        planDuration={planDuration!}
        eventCredits={eventCredits!}
        events={events!}
        EventError={eventError}
        EventSuccess={eventSuccess}
        planFeatures={planFeatures}
        id={id}
        totalMedia={totalMedia}
        totalMaxUploads={totalMaxUploads}
        totalEvents={totalEvents}
      />
    </>
  );
};

export default DashboardPage;
