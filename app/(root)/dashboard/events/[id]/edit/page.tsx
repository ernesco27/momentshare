import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import EventCreationContainer from "@/components/EventCreationContainer";
import ROUTES from "@/constants/route";
import { getEvent } from "@/lib/actions/event.action";
import { getUser } from "@/lib/actions/user.action";
import { RouteParams } from "@/types/global";

const EditEvent = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();

  const userId = session?.user?.id;
  if (!userId) return redirect("/sign-in");

  const [userResponse, eventResponse] = await Promise.all([
    getUser({ userId }),
    getEvent({ eventId: id }),
  ]);

  const { data: user, success: userSuccess } = userResponse!;
  if (!userSuccess) return notFound();

  const { data: event, success: eventSuccess } = eventResponse!;
  if (!eventSuccess) return notFound();

  if (event?.organizer.toString() !== user?._id) {
    return redirect(ROUTES.DASHBOARD);
  }

  return (
    <>
      <EventCreationContainer event={event!} isEdit />
    </>
  );
};

export default EditEvent;
