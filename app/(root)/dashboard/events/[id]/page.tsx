import { redirect } from "next/navigation";

import EventDetails from "@/components/modules/dashboard/EventDetails";
import ROUTES from "@/constants/route";
import { getEvent } from "@/lib/actions/event.action";
import { getUser } from "@/lib/actions/user.action";
import { RouteParams } from "@/types/global";

const EventDetailsPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const { data: event } = await getEvent({ eventId: id });

  if (!event) {
    return redirect(ROUTES.EVENTS);
  }

  const user = await getUser({ userId: event.organizer! });

  const { downloadQrFlyer } = user.data!;

  return (
    <>
      <EventDetails event={event!} isDownloadQrFlyer={downloadQrFlyer} />
    </>
  );
};

export default EventDetailsPage;
