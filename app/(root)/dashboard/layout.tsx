import { ReactNode } from "react";

import LeftSidebar from "@/components/modules/dashboard/LeftSidebar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className=" relative">
      <div className="flex">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-6 py-8 max-md:pb-14 sm:px-14 ">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default DashboardLayout;
