import GalleryContainer from "@/components/GalleryContainer";
import { getEvent } from "@/lib/actions/event.action";
import { RouteParams } from "@/types/global";

const GalleryPage = async ({ params }: RouteParams) => {
  const { id } = await params!;

  const { success, data: event, error } = await getEvent({ eventId: id });

  if (!event) return <div>Event not found</div>;

  return (
    <>
      {" "}
      <GalleryContainer event={event!} success={success} error={error} />{" "}
    </>
  );
};

export default GalleryPage;
