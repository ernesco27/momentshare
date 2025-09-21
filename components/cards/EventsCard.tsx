import { Calendar } from "lucide-react";
import React from "react";

import { EMPTY_EVENT } from "@/constants/states";
import { Event } from "@/types/global";

import DataRenderer from "../DataRenderer";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Props {
  events: Event[];
  success: boolean;
  error?: ApiError;
}

const EventsCard = ({ events, success, error }: Props) => {
  return (
    <Card className="card-wrapper light-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="h2-semibold text-dark100_light900">
          Events
        </CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="text-center flex flex-col gap-4">
        <DataRenderer
          data={events}
          success={success}
          error={error}
          empty={EMPTY_EVENT}
          render={(events) => (
            <div>
              {events.map((event) => (
                <Button
                  key={event._id}
                  size="lg"
                  className="w-full hover:bg-primary-500/5 cursor-pointer py-10 "
                >
                  <div className="flex gap-2 items-start flex-col w-full">
                    <h3 className="h3-semibold text-dark100_light900">
                      {event.title}
                    </h3>
                    <p className="text-xs text-light-400">
                      312 uploads • Expires{" "}
                      {new Date(event.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          )}
        />
        {/* <Button
          size="lg"
          className="w-full hover:bg-primary-500/5 cursor-pointer py-10 "
        >
          <div className="flex gap-2 items-start flex-col w-full">
            <h3 className="h3-semibold text-dark100_light900">
              Ama & Kojo&apos;s Wedding
            </h3>
            <p className="text-xs text-light-400">
              312 uploads • Expires 12/12/2025
            </p>
          </div>
        </Button>
        <Button
          size="lg"
          className="w-full hover:bg-primary-500/5 cursor-pointer py-10 "
        >
          <div className="flex gap-2 items-start flex-col w-full">
            <h3 className="h3-semibold text-dark100_light900">
              Ama & Kojo&apos;s Wedding
            </h3>
            <p className="text-xs text-light-400">
              312 uploads • Expires 12/12/2025
            </p>
          </div>
        </Button>
        <Button
          size="lg"
          className="w-full hover:bg-primary-500/5 cursor-pointer py-10 "
        >
          <div className="flex gap-2 items-start flex-col w-full">
            <h3 className="h3-semibold text-dark100_light900">
              Ama & Kojo&apos;s Wedding
            </h3>
            <p className="text-xs text-light-400">
              312 uploads • Expires 12/12/2025
            </p>
          </div>
        </Button> */}
      </CardContent>
    </Card>
  );
};

export default EventsCard;
