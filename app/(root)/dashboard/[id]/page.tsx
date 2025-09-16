import Dashboard from "@/components/modules/dashboard/Dashboard";
import { RouteParams } from "@/types/global";

const DashboardPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  return (
    <>
      <Dashboard />
    </>
  );
};

export default DashboardPage;
