import { notFound } from "next/navigation";

import UploadContainer from "@/components/UploadContainer";
import { FEATURE } from "@/constants";
import { getEventByQR } from "@/lib/actions/event.action";
import { getPlans } from "@/lib/actions/plan.action";
import { isFeatureEnabledForPlan } from "@/lib/utils";
import { RouteParams } from "@/types/global";

const UploadPage = async ({ params }: RouteParams) => {
  const { qrCode } = await params;

  const [eventResponse, plansResponse] = await Promise.all([
    getEventByQR({ qrCode }),
    getPlans(),
  ]);

  const event = eventResponse.data;
  const plans = plansResponse.data;

  if (!event) return notFound();

  const planId = event?.organizer.activePlan;

  const isVideoUploadAllowed = isFeatureEnabledForPlan(
    plans!,
    planId!,
    FEATURE.VIDEO_UPLOADS
  );

  console.log("isVideoUploadAllowed: ", isVideoUploadAllowed);

  return (
    <div>
      <UploadContainer
        event={event!}
        isVideoUploadAllowed={isVideoUploadAllowed}
      />
    </div>
  );
};

export default UploadPage;
