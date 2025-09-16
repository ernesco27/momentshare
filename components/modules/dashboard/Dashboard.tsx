import { auth } from "@/auth";
import DashCards from "@/components/cards/DashCards";
import EventsCard from "@/components/cards/EventsCard";
import MetricsCard from "@/components/cards/MetricsCard";
import { Button } from "@/components/ui/button";

const Dashboard = async () => {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="w-full flex flex-col justify-between gap-4 ">
      <p className="text-md text-dark400_light500">
        Welcome back,{" "}
        <span className="primary-text-gradient">{user!.name}!</span>
      </p>

      <header className="flex-between w-full">
        <h1 className="h2-bold  lg:h1-bold  text-dark100_light900">
          Dashboard
        </h1>
        <Button
          size="lg"
          className="bg-primary-500 hover:primary-dark-gradient   transition-all duration-300 ease-in-out  text-white text-md lg:text-lg font-semibold hover:shadow-primary-500/50 hover:shadow-md cursor-pointer"
        >
          Create Event
        </Button>
      </header>
      <main className="">
        <section className="lg:col-span-1 space-y-4">
          <div className="grid grid-cols-2 gap-4 ">
            <DashCards />
            <DashCards />
            <DashCards />
            <DashCards />
          </div>
        </section>
        <div className="mt-8">
          <EventsCard />
        </div>
        <div className="mt-8">
          <MetricsCard />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
