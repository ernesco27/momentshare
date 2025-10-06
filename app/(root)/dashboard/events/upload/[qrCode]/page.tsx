import UploadContainer from "@/components/UploadContainer";
import { getEventByQR } from "@/lib/actions/event.action";
import { RouteParams } from "@/types/global";

const UploadPage = async ({ params }: RouteParams) => {
  const { qrCode } = await params;

  const {
    success,
    data: event,
    error,
  } = await getEventByQR({ qrCode: qrCode });

  console.log("event:", event);

  return (
    <div>
      <UploadContainer event={event!} />
    </div>
  );
};

export default UploadPage;
