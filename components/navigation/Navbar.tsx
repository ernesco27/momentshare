import Image from "next/image";
import Link from "next/link";

import { auth, signOut } from "@/auth";
import ROUTES from "@/constants/route";

import UserAvatar from "../UserAvatar";
import MobileNavigation from "./MobileNavigation";
import NavLinks from "./NavLinks";
import Theme from "./Theme";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Navbar = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  return (
    <nav
      className=" sticky top-4 z-50
  mx-auto w-[98%] 
  rounded-2xl
  border border-white/20 
  bg-white/30 dark:bg-dark-200/30 
  backdrop-blur-md 
  shadow-lg 
  flex-between gap-5 p-2 sm:px-12"
    >
      <Link href="/" className="overflow-hidden">
        <div className="relative h-12 w-32">
          <Image
            src="/images/Logo.svg"
            alt="MomentShare logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </Link>
      <div className="hidden md:flex md:gap-8">
        <NavLinks userId={userId!} />
      </div>

      <div className="flex-between gap-5">
        <div className="hidden md:flex">
          <Theme />
        </div>

        <div className="flex gap-3">
          {!userId ? (
            <>
              <Button className="small-medium  min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none cursor-pointer bg-green-600">
                <Link href={ROUTES.SIGN_IN}>
                  <span className="paragraph-semibold">Get Started</span>
                </Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <UserAvatar
                  id={userId!}
                  name={session.user!.name!}
                  imageUrl={session.user?.image}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="background-light900_dark200"
              >
                <DropdownMenuItem>
                  <Button className="small-medium  min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none cursor-pointer primary-gradient">
                    <Link href={ROUTES.DASHBOARD}>
                      <span className="paragraph-semibold">Dashboard</span>
                    </Link>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <form
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    <Button
                      type="submit"
                      className="base-medium w-fit !bg-transparent px-4 py-3 cursor-pointer"
                    >
                      <Image
                        src="/icons/logout-3.svg"
                        alt="Logout"
                        width={20}
                        height={20}
                        className="invert-colors"
                      />
                      <span className="text-dark300_light900">Log Out</span>
                    </Button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;
