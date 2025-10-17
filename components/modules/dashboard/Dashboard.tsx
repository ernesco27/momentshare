"use client";

import { BadgeCheck, CircleCheck, CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import DashCards from "@/components/cards/DashCards";
import EventsCard from "@/components/cards/EventsCard";
import MetricsCard from "@/components/cards/MetricsCard";
import PlanDashCards from "@/components/cards/PlanDashCard";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/route";
import { IPlanFeature } from "@/database/planFeatures.model";
import { AverageUploads, engagementRate, getExpiryDetails } from "@/lib/utils";
import { GlobalEvent } from "@/types/global";

interface Props {
  name: string;
  isProSubscriber: boolean;
  proSubscriptionEndDate: Date;
  planName: string;
  eventCredits: number;
  events: GlobalEvent[];
  EventError?: ApiError;
  EventSuccess: boolean;
  planFeatures: IPlanFeature[];
  id: string;
  totalMedia: number;
  totalMaxUploads: number;
  totalEvents: number;
  tierActivationDate?: Date;
  isAnalyticsAllowed: boolean;
}

const Dashboard = ({
  name,
  tierActivationDate,
  planName,
  planFeatures,
  eventCredits,
  events,
  EventError,
  EventSuccess,
  id,
  totalMedia,
  totalMaxUploads,
  totalEvents,
  isProSubscriber,
  proSubscriptionEndDate,
  isAnalyticsAllowed,
}: Props) => {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<GlobalEvent | undefined>();

  const handleCreateEvent = () => {
    if (eventCredits === 0 && !isProSubscriber) {
      toast.error(
        "You have no event credits left. Please buy credit or upgrade your plan to create more events."
      );
      return;
    }

    if (isProSubscriber && proSubscriptionEndDate < new Date()) {
      toast.error(
        "Your plan has expired. Please upgrade your plan to create more events."
      );
      return;
    }

    router.push(ROUTES.CREATE_EVENT(id));
  };

  const activeEvents = events.filter((event) => {
    const isExpired = event ? new Date(event.expiryDate) < new Date() : false;

    return !isExpired;
  });

  const isActiveSubscription = isProSubscriber
    ? new Date(proSubscriptionEndDate) > new Date()
    : false;

  const getFeatureDisplay = (feature: IPlanFeature) => {
    const formattedKey = feature.featureKey.replaceAll("_", " ");

    if (feature.enabled) {
      if (feature.limit !== undefined && feature.limit !== null) {
        return (
          <li
            key={feature.featureKey}
            className="flex items-center gap-2 text-dark200_light800"
          >
            <CircleCheck className="text-green-500 h-5 w-5" />
            <span className="paragraph-semibold">
              {feature.limit === -1
                ? "Unlimited"
                : feature.limit.toLocaleString()}{" "}
              {formattedKey}
            </span>
          </li>
        );
      } else {
        return (
          <li
            key={feature.featureKey}
            className="flex items-center gap-2 text-dark200_light800"
          >
            <CircleCheck className="text-green-500 h-5 w-5" />
            <span className="paragraph-semibold">{formattedKey}</span>
          </li>
        );
      }
    } else {
      // Feature is not enabled
      return (
        <li
          key={feature.featureKey}
          className="flex items-center gap-2 text-dark200_light800"
        >
          <CircleX className="text-red-500 h-5 w-5" />
          <span className="text-dark400_light500 paragraph-regular">
            {formattedKey}
          </span>
        </li>
      );
    }
  };

  const sortedPlanFeatures = [...planFeatures].sort((a, b) => {
    if (a.enabled && !b.enabled) {
      return -1;
    }
    if (!a.enabled && b.enabled) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="flex gap-8">
      <main className="flex-1 w-full flex flex-col justify-between gap-4 ">
        <div className="flex-between w-full mb-6">
          <p className="text-md text-dark400_light500">
            Welcome back, <span className="primary-text-gradient">{name}!</span>
          </p>
          <div className=" px-2 h-[30px] rounded-lg flex-center text-dark200_light900 paragraph-semibold">
            {isProSubscriber ? "Pro" : "Standard"}
            <span>
              <BadgeCheck fill="green" className="h-5 w-5 ml-2 text-white " />
            </span>
          </div>
        </div>

        <header className="flex-between w-full">
          <h1 className="h2-bold  lg:h1-bold  text-dark100_light900">
            Dashboard
          </h1>
          <Button
            onClick={handleCreateEvent}
            size="lg"
            className="bg-primary-500 hover:primary-dark-gradient transition-all duration-300 ease-in-out  text-white text-md lg:text-lg font-semibold hover:shadow-primary-500/50 hover:shadow-sm cursor-pointer"
          >
            Create Event
          </Button>
        </header>
        <div>
          <section className="lg:col-span-1 space-y-4">
            <div className="grid grid-cols-1 min-md:grid-cols-2 gap-4 ">
              <DashCards
                otherClasses="bg-[#6ee7b7]!"
                heading="Active Events"
                info={activeEvents.length}
                description="Total Active Event(s)"
              />
              <DashCards
                otherClasses="bg-[#67e8f9]!"
                heading="Total Media Uploads"
                info={totalMedia}
                description="Toal Photos/Videos Uploaded"
              />
              {!isProSubscriber && (
                <DashCards
                  otherClasses="bg-[#d8b4fe]!"
                  heading="Engagement Rate"
                  info={`${engagementRate(totalMedia, totalMaxUploads) || 0}%`}
                  description="Average Guest Engagement Rate"
                />
              )}
              {isProSubscriber && (
                <DashCards
                  otherClasses="bg-[#d8b4fe]!"
                  heading="Average Uploads"
                  info={`${Number(AverageUploads(totalMedia, totalEvents)) || 0}%`}
                  description="Average Guest Contribution Rate"
                />
              )}

              <PlanDashCards
                otherClasses="bg-[#fde68a]!"
                heading={`Active Plan (${planName})`}
                info={
                  !isProSubscriber
                    ? eventCredits
                    : getExpiryDetails(tierActivationDate)!.daysLeft
                }
                description={isProSubscriber ? "Days Left" : "Credit(s) Left"}
                activationDate={tierActivationDate}
                isProSubscriber={isProSubscriber}
                activeStatus={isActiveSubscription}
              />
            </div>
          </section>
          <div className="mt-8">
            <EventsCard
              events={events}
              error={EventError}
              success={EventSuccess}
              onEventSelect={setSelectedEvent}
              selectedEventId={selectedEvent?._id}
            />
          </div>
          <div className="mt-8">
            <MetricsCard
              selectedEvent={selectedEvent}
              isAnalyticsAllowed={isAnalyticsAllowed}
            />
          </div>
        </div>
      </main>
      <aside className="min-h-screen w-[30%] background-light800_dark200 rounded-lg max-lg:hidden flex flex-col gap-8 p-4">
        <section className="card-wrapper p-4 rounded-lg">
          <h1 className="h3-bold text-dark200_light800">
            Account Limits & Features
          </h1>
          <ul className="space-y-2 mt-4">
            {sortedPlanFeatures.map((feature) => getFeatureDisplay(feature))}
          </ul>
        </section>
      </aside>
    </div>
  );
};

export default Dashboard;
