import { notFound } from "next/navigation";

import UploadContainer from "@/components/UploadContainer";
import { getEventByQR } from "@/lib/actions/event.action";
import { RouteParams } from "@/types/global";

const UploadPage = async ({ params }: RouteParams) => {
  const { qrCode } = await params;

  const { data: event } = await getEventByQR({ qrCode: qrCode });

  if (!event) return notFound();

  return (
    <div>
      <UploadContainer event={event!} />
    </div>
  );
};

export default UploadPage;
