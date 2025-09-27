import { redirect } from "next/navigation";

import EventCreationForm from "@/components/forms/EventCreationForm";
import { getAccount } from "@/lib/actions/account.action";
import { getPlan } from "@/lib/actions/plan.action";
import { RouteParams } from "@/types/global";

const CreateEvent = async ({ params }: RouteParams) => {
  const { id } = await params;

  const { data: account } = await getAccount({ userId: id });

  const { activePlan, eventCredits } = account!;

  if (eventCredits === 0) {
    return redirect("/sign-in");
  }

  const { data: plan } = await getPlan({ planId: activePlan! });

  const planFeatures = plan?.features || [];

  return (
    <main className="flex min-h-screen flex-1 flex-col px-6 py-36 max-md:pb-14 sm:px-14 max-w-5xl mx-auto">
      <h1 className="h1-bold text-dark100_light900">Create Event</h1>
      <p className="paragraph-medium text-dark400_light500">
        Set up a new memories collection event for your attendees.
      </p>

      <EventCreationForm planFeatures={planFeatures} />
    </main>
  );
};

export default CreateEvent;
