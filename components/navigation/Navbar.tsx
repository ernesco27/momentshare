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
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full p-2 dark:shadow-none sm:px-12 shadow-light-300 gap-5">
      <Link href="/" className="overflow-hidden">
        <Image
          src="/images/Logo.svg"
          width={120}
          height={120}
          alt="MomentShare logo"
        />
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
                    <Link href={ROUTES.SIGN_IN}>
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

        {/* {session?.user?.id && (
          <UserAvatar
            id={session?.user?.id}
            name={session.user.name!}
            imageUrl={session.user?.image}
          />
        )}  */}
        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;
