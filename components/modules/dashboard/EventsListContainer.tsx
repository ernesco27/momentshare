"use client";

import { format, isAfter } from "date-fns";
import { Calendar, Eye, Image, QrCode, Share2, Trash2 } from "lucide-react";
import { useState } from "react";

import DataRenderer from "@/components/DataRenderer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EMPTY_EVENT } from "@/constants/states";
import { GlobalEvent } from "@/types/global";

interface EventProps {
  events: GlobalEvent[];
  hasMore: boolean;
  success: boolean;
  error?: ApiError;
}

const EventsListContainer = ({
  events,
  success,
  error,
  hasMore,
}: EventProps) => {
  console.log("EventsListContainer events:", events);
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <main className="flex min-h-screen flex-1 flex-col px-6 py-36 max-md:pb-14 sm:px-14 max-w-5xl mx-auto">
      <h1 className="mb-6 h1-bold font-bold primary-text-gradient">
        Your Events
      </h1>

      <DataRenderer
        data={events}
        success={success}
        error={error}
        empty={EMPTY_EVENT}
        render={(events) => (
          <div>
            {events.map((event) => {
              const isExpired = !isAfter(
                new Date(event.expiryDate),
                new Date()
              );
              return (
                <Card
                  key={event._id}
                  className="card-wrapper light-border mb-4 background-light900_dark200"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-dark200_light800">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="mt-1 text-light-400 line-clamp-2">
                          {event.description || "No description provided"}
                        </CardDescription>
                      </div>
                      <Badge
                        className="bg-green-500 text-white"
                        variant={isExpired ? "secondary" : "default"}
                      >
                        {isExpired ? "Expired" : "Active"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex-center space-x-1 text-dark400_light900">
                        <Calendar className="h-4 w-4" />
                        <span className="text-red-500">
                          Expires{" "}
                          {format(new Date(event.expiryDate), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-dark400_light900">
                        <Image className="h-4 w-4" />
                        {/* <span>{event.media_count || 0} photos</span> */}
                        <span>0 photos</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => {}}
                        variant="outline"
                        size="sm"
                        className="btn flex-1 primary-dark-gradient text-white hover:shadow-[0_0_4px_1px_rgba(245,158,11,0.6)] dark:hover:shadow-[0_0_15px_2px_rgba(245,158,11,0.7)] transition duration-300 ease-in-out cursor-pointer"
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        View Details / QR Code
                      </Button>

                      {/* <Button
                        onClick={() => {}}
                        variant="outline"
                        size="sm"
                        className="flex-1 primary-gradient hover:shadow-[0_0_4px_1px_rgba(245,158,11,0.6)] dark:hover:shadow-[0_0_15px_2px_rgba(245,158,11,0.7)] transition duration-300 ease-in-out cursor-pointer"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button> */}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => {}}
                        variant="default"
                        size="sm"
                        className="flex-1 text-white bg-green-400 hover:bg-green-500 transition duration-300 ease-in-out cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Gallery
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:bg-red-500 hover:text-white transition duration-300 ease-in-out cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="light-border background-light900_dark200">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-500">
                              Delete Event
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-dark200_light800">
                              Are you sure you want to delete {event.title}?
                              This will permanently remove the event and all
                              uploaded photos. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-red-500 hover:bg-slate-200/50 cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {}}
                              //   disabled={isDeleting}
                              className="bg-red-500 text-white hover:bg-red-600 transition duration-300 ease-in-out cursor-pointer"
                            >
                              {isDeleting ? "Deleting..." : "Delete Event"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      />
    </main>
  );
};

export default EventsListContainer;
