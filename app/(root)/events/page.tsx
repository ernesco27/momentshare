import { auth } from "@/auth";
import EventsListContainer from "@/components/modules/dashboard/EventsListContainer";
import { getEvents } from "@/lib/actions/event.action";
import { RouteParams } from "@/types/global";

const EventsListPage = async ({ searchParams }: RouteParams) => {
  const session = await auth();
  const user = session?.user;

  const { page, pageSize } = await searchParams;

  if (!user) {
    return (
      <main className="flex min-h-screen flex-1 flex-col px-6 py-36 max-md:pb-14 sm:px-14 ">
        Please sign in to view your events.
      </main>
    );
  }

  const userId = user.id;

  const { success, data, error } = await getEvents({
    userId: userId!,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });
  const { events, isNext } = data || {};

  return (
    <>
      <EventsListContainer
        events={events!}
        hasMore={isNext!}
        success={success}
        error={error}
        page={Number(page) || 1}
      />
    </>
  );
};

export default EventsListPage;
