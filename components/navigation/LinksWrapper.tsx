"use client";

import { usePathname } from "next/navigation";

import NavLinks from "./NavLinks";

const LinksWrapper = ({ userId }: { userId: string }) => {
  const pathname = usePathname();

  const isDashboard = pathname.includes("/dashboard");

  return (
    <div className="flex flex-col gap-8 h-full">
      <NavLinks isDashboard={isDashboard} userId={userId!} />
    </div>
  );
};

export default LinksWrapper;
