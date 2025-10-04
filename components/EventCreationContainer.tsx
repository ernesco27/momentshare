"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { GlobalEvent } from "@/types/global";

import EventCreationForm from "./forms/EventCreationForm";
import { Button } from "./ui/button";

interface Props {
  event: GlobalEvent;
  isEdit: boolean;
}

const EventCreationContainer = ({ event, isEdit }: Props) => {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-1 flex-col px-6 py-12 max-md:pb-14 sm:px-14 max-w-5xl mx-auto">
      <Button
        onClick={() => router.back()}
        variant="link"
        size="sm"
        className="w-[100px] mb-6 bg-primary-500 hover:primary-dark-gradient transition-all duration-300 ease-in-out  text-white font-semibold hover:shadow-primary-500/50 hover:shadow-sm cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span className="max-sm:hidden">Back</span>
      </Button>
      <h1 className="h1-bold text-dark100_light900">Update Event</h1>
      <p className="paragraph-medium text-dark400_light500">
        Set up a new memories collection event for your attendees.
      </p>

      <EventCreationForm event={event} isEdit={isEdit} />
    </main>
  );
};

export default EventCreationContainer;
