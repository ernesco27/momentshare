import { auth } from "@/auth";
import EventsListContainer from "@/components/modules/dashboard/EventsListContainer";
import { getEvents } from "@/lib/actions/event.action";

const EventsListPage = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <main className="flex min-h-screen flex-1 flex-col px-6 py-36 max-md:pb-14 sm:px-14 ">
        Please sign in to view your events.
      </main>
    );
  }

  const userId = user.id;

  const { success, data, error } = await getEvents({ userId: userId! });
  const { events, isNext } = data || {};

  console.log("events:", events);

  return (
    <>
      <EventsListContainer
        events={events!}
        hasMore={isNext!}
        success={success}
        error={error}
      />
    </>
  );
};

export default EventsListPage;
