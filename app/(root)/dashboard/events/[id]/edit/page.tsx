import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import EventCreationContainer from "@/components/EventCreationContainer";
import ROUTES from "@/constants/route";
import { getAccount } from "@/lib/actions/account.action";
import { getEvent } from "@/lib/actions/event.action";
import { RouteParams } from "@/types/global";

const EditEvent = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();

  const userId = session?.user?.id;
  if (!userId) return redirect("/sign-in");

  const [accountResponse, eventResponse] = await Promise.all([
    getAccount({ userId }),
    getEvent({ eventId: id }),
  ]);

  const { data: account, success: accountSuccess } = accountResponse;
  if (!accountSuccess) return notFound();

  const { data: event, success: eventSuccess } = eventResponse;
  if (!eventSuccess) return notFound();

  if (event?.organizer._id.toString() !== account?._id) {
    return redirect(ROUTES.DASHBOARD(userId));
  }

  return (
    <>
      <EventCreationContainer event={event!} isEdit />
    </>
  );
};

export default EditEvent;
