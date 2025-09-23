"use client";

import { BadgeCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import DashCards from "@/components/cards/DashCards";
import EventsCard from "@/components/cards/EventsCard";
import MetricsCard from "@/components/cards/MetricsCard";
import EventCreationForm from "@/components/forms/EventCreationForm";
import { Button } from "@/components/ui/button";
import { IPlanFeature } from "@/database/planFeatures.model";
import { ApiError } from "@/types/action";
import { Event } from "@/types/global";

interface Props {
  name: string;
  accountType: string;
  planName: string;
  planDuration: string;
  eventCredits: number;
  events: Event[];
  EventError?: ApiError;
  EventSuccess: boolean;
  planFeatures: IPlanFeature[];
  accountId: string;
}

const Dashboard = ({
  name,
  accountType,
  planName,
  planDuration,
  eventCredits,
  events,
  EventError,
  EventSuccess,
  planFeatures,
  accountId,
}: Props) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateEvent = () => {
    if (eventCredits === 0 && accountType === "STANDARD") {
      toast.error(
        "You have no event credits left. Please upgrade your plan to create more events."
      );
      return;
    }
    setShowCreateDialog(true);
  };

  return (
    <div className="w-full flex flex-col justify-between gap-4 ">
      <div className="flex-between w-full mb-6">
        <p className="text-md text-dark400_light500">
          Welcome back, <span className="primary-text-gradient">{name}!</span>
        </p>
        <div className=" px-2 h-[30px] rounded-lg flex-center text-dark200_light900 paragraph-semibold">
          {accountType}
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
          className="bg-primary-500 hover:primary-dark-gradient   transition-all duration-300 ease-in-out  text-white text-md lg:text-lg font-semibold hover:shadow-primary-500/50 hover:shadow-md cursor-pointer"
        >
          Create Event
        </Button>
      </header>
      <main className="">
        <section className="lg:col-span-1 space-y-4">
          <div className="grid grid-cols-2 gap-4 ">
            <DashCards
              otherClasses="bg-[#6ee7b7]!"
              heading="Active Events"
              info="1"
              description="Total Active Event(s)"
            />
            <DashCards
              otherClasses="bg-[#67e8f9]!"
              heading="Total Uploads"
              info="425"
              description="Toal Photos/Videos Uploaded"
            />
            <DashCards
              otherClasses="bg-[#d8b4fe]!"
              heading="Engagement Rate"
              info="60%"
              description="Average Guest Engagement Rate"
            />
            <DashCards
              otherClasses="bg-[#fde68a]!"
              heading={`Active Plan - ${planName}`}
              accountType={accountType}
              info={accountType === "STANDARD" ? eventCredits : planDuration}
              description={
                accountType === "STANDARD" ? "Event Credits Left" : "Days Left"
              }
            />
          </div>
        </section>
        <div className="mt-8">
          <EventsCard
            events={events}
            error={EventError}
            success={EventSuccess}
          />
        </div>
        <div className="mt-8">
          <MetricsCard />
        </div>
      </main>
      <EventCreationForm
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        planFeatures={planFeatures}
        accountId={accountId}
      />
    </div>
  );
};

export default Dashboard;
