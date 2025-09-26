import UploadContainer from "@/components/UploadContainer";
import { getEvent } from "@/lib/actions/event.action";
import { RouteParams } from "@/types/global";

const UploadPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const { success, data: event, error } = await getEvent({ eventId: id });

  console.log("event:", event);

  return (
    <div>
      <UploadContainer event={event!} />
    </div>
  );
};

export default UploadPage;
