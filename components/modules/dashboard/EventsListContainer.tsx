"use client";

import { format, isAfter } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Eye,
  ImageIcon,
  Pen,
  QrCode,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
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
import { Spinner } from "@/components/ui/spinner";
import ROUTES from "@/constants/route";
import { EMPTY_EVENT } from "@/constants/states";
import { deleteEvent } from "@/lib/actions/event.action";
import handleError from "@/lib/handlers/error";
import { ErrorResponse, GlobalEvent } from "@/types/global";

interface EventProps {
  events: GlobalEvent[];
  hasMore: boolean;
  success: boolean;
  error?: ApiError;
  page: number;
}

const EventsListContainer = ({
  events,
  success,
  error,
  hasMore,
  page,
}: EventProps) => {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewDetails = (id: string) => {
    router.push(ROUTES.EVENT(id));
  };

  const handleDeleteEvent = async (id: string) => {
    setIsDeleting(true);

    try {
      await deleteEvent({ eventId: id });
      toast.success("Event deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete event!");
      return handleError(error as ErrorResponse);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="flex min-h-screen  flex-col px-6 py-14 max-md:pb-14 sm:px-14 max-w-5xl mx-auto">
      <Button
        onClick={() => router.back()}
        variant="link"
        size="sm"
        className="w-[100px] bg-primary-500 hover:primary-dark-gradient transition-all duration-300 ease-in-out  text-white font-semibold hover:shadow-primary-500/50 hover:shadow-sm cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span className="max-sm:hidden">Back</span>
      </Button>
      <h1 className="mb-6 mt-4 h3-bold lg:h1-bold font-bold primary-text-gradient">
        My Events
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
                        <CardTitle className="text-[16px] lg:text-lg text-dark200_light800">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="mt-1 text-light-400 line-clamp-2 text-sm">
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
                        <ImageIcon className="h-4 w-4" />
                        <span>{event.totalMedia || 0} Photos/Videos</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleViewDetails(event._id!)}
                        variant="outline"
                        size="sm"
                        className="btn flex-1 primary-dark-gradient text-white hover:shadow-[0_0_4px_1px_rgba(245,158,11,0.6)] dark:hover:shadow-[0_0_15px_2px_rgba(245,158,11,0.7)] transition duration-300 ease-in-out cursor-pointer"
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        View Details / QR Code
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => router.push(ROUTES.GALLERY(event._id))}
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
                            disabled={isDeleting}
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:bg-red-500 hover:text-white transition duration-300 ease-in-out cursor-pointer"
                          >
                            {isDeleting ? (
                              <Spinner className="size-4" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="light-border background-light900_dark200">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-500">
                              Delete Event
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-dark200_light800">
                              Are you sure you want to delete
                              <span className="font-semibold pl-1 text-red-500">
                                {event.title}
                              </span>
                              ? This will permanently remove the event and all
                              uploaded photos/videos. This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-red-500 hover:bg-slate-200/50 cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                handleDeleteEvent(event._id!);
                              }}
                              className="bg-red-500 text-white hover:bg-red-600 transition duration-300 ease-in-out cursor-pointer"
                            >
                              Delete Event
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button
                        onClick={() => {
                          router.push(ROUTES.EDIT_EVENT(event._id));
                        }}
                        variant="outline"
                        size="sm"
                        className="text-green-500 hover:bg-green-500 hover:text-white transition duration-300 ease-in-out cursor-pointer"
                      >
                        <Pen className="h-4 w-4 mr-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      />
      <Pagination page={page} isNext={hasMore} />
    </main>
  );
};

export default EventsListContainer;
