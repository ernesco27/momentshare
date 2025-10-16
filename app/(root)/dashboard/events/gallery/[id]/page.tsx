import MediaGallery from "@/components/GalleryContainer";
import { getEvent } from "@/lib/actions/event.action";
import { getEventMedia } from "@/lib/actions/media.action";
import { RouteParams } from "@/types/global";

const GalleryPage = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params!;
  const { page, pageSize } = await searchParams;

  const [eventResponse, mediaResponse] = await Promise.all([
    getEvent({ eventId: id }),
    getEventMedia({
      eventId: id,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
    }),
  ]);

  const { data: eventData } = eventResponse;

  const {
    success: mediaSuccess,
    data: mediaData,
    error: mediaError,
  } = mediaResponse;

  console.log("eventData", eventData);

  if (!eventData) return <div>Event not found</div>;

  const { totalMedia, media, isNext } = mediaData!;

  return (
    <>
      {" "}
      <MediaGallery
        event={eventData!}
        success={mediaSuccess}
        error={mediaError}
        totalMedia={totalMedia || 0}
        media={media}
        isNext={isNext || false}
        page={Number(page) || 1}
      />{" "}
    </>
  );
};

export default GalleryPage;
