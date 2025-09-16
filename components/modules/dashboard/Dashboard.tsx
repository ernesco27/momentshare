import { auth } from "@/auth";
import DashCards from "@/components/cards/DashCards";

const Dashboard = async () => {
  const session = await auth();
  const user = session?.user;
  return (
    <section className="w-full flex flex-col justify-between gap-4 ">
      <div className="flex-between w-full">
        <h1 className="h1-bold text-dark100_light900">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{`Welcome back, ${user!.name} `}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashCards />
        <DashCards />
        <DashCards />
        <DashCards />
      </div>
    </section>
  );
};

export default Dashboard;
