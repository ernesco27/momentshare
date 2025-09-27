import EventDetails from "@/components/modules/dashboard/EventDetails";
import { getEvent } from "@/lib/actions/event.action";
import { RouteParams } from "@/types/global";

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
