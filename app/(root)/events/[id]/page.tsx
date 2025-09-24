import { toast } from "sonner";

import EventDetails from "@/components/modules/dashboard/EventDetails";
import { getEvent } from "@/lib/actions/event.action";
import handleError from "@/lib/handlers/error";
import { ErrorResponse, RouteParams } from "@/types/global";

const EventDetailsPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const { data: event } = await getEvent({ eventId: id });

  return (
    <>
      <EventDetails event={event!} />
    </>
  );
};

export default EventDetailsPage;
