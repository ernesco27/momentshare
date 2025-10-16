import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import EventCreationForm from "@/components/forms/EventCreationForm";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/route";
import { getPlan } from "@/lib/actions/plan.action";
import { getUser } from "@/lib/actions/user.action";
import { RouteParams } from "@/types/global";

const CreateEvent = async ({ params }: RouteParams) => {
  const { id } = await params;

  const { data: user } = await getUser({ userId: id });

  const { activePlan, eventCredits, isProSubscriber, proSubscriptionEndDate } =
    user!;

  const isActiveSubscription = isProSubscriber
    ? new Date(proSubscriptionEndDate!) > new Date()
    : false;

  if (
    (!isProSubscriber && eventCredits === 0) ||
    (isProSubscriber && !isActiveSubscription)
  ) {
    return redirect("/pricing");
  }

  const { data: plan } = await getPlan({ planId: activePlan! });

  const planFeatures = plan?.features || [];

  return (
    <main className="flex min-h-screen flex-1 flex-col px-6  max-md:pb-14 sm:px-14 max-w-5xl mx-auto">
      <Link href={ROUTES.DASHBOARD}>
        <Button
          variant="link"
          size="sm"
          className="w-[100px] my-4 bg-primary-500 hover:primary-dark-gradient transition-all duration-300 ease-in-out  text-white font-semibold hover:shadow-primary-500/50 hover:shadow-sm cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="max-sm:hidden">Back</span>
        </Button>
      </Link>
      <h1 className="h1-bold text-dark100_light900">Create Event</h1>
      <p className="paragraph-medium text-dark400_light500">
        Set up a new memories collection event for your attendees.
      </p>

      <EventCreationForm planFeatures={planFeatures} />
    </main>
  );
};

export default CreateEvent;
