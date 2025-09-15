"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// Assuming both navLinks and dashNavLinks are arrays of objects with { route, label, imgURL? }
import { navLinks, dashNavLinks } from "@/constants";
import { cn } from "@/lib/utils";

import { SheetClose } from "../ui/sheet";

// Define a type for your navigation link items for better type safety
interface NavLinkItem {
  route: string;
  label: string;
  imgURL?: string; // imgURL is optional, as dashNavLinks might not have it
}

const NavLinks = ({
  isMobileNav = false,
  userId,
  isDashboard = false,
}: {
  isMobileNav?: boolean;
  userId: string;
  isDashboard?: boolean;
}) => {
  const pathname = usePathname();

  const renderNavLinks = (links: NavLinkItem[]) => {
    return links.map((item) => {
      // Create a mutable copy of the item to modify its route without affecting the original array
      const currentItem: NavLinkItem = { ...item };

      const isActive =
        (pathname.includes(currentItem.route) &&
          currentItem.route.length > 1) ||
        pathname === currentItem.route;

      if (currentItem.route === "/profile") {
        if (userId) currentItem.route = `${currentItem.route}/${userId}`;
        else return null; // If profile route and no userId, don't render this link
      }

      const LinkComponent = (
        <Link
          href={currentItem.route}
          key={currentItem.label} // Use currentItem.label for key
          className={cn(
            isActive
              ? "primary-gradient rounded-lg text-light-900"
              : "text-dark300_light900",
            "flex items-center justify-start gap-4 bg-transparent p-2 "
          )}
        >
          {/* Conditionally render Image only if imgURL exists for the current item */}
          {currentItem.imgURL && (
            <Image
              src={currentItem.imgURL}
              alt={currentItem.label} // Use currentItem.label for alt text
              width={20}
              height={20}
              className={cn({ "invert-colors": !isActive })}
            />
          )}
          <p className={cn(isActive ? "base-bold" : "base-medium")}>
            {currentItem.label} {/* Use currentItem.label for text */}
          </p>
        </Link>
      );

      return isMobileNav ? (
        <SheetClose asChild key={currentItem.route}>
          {LinkComponent}
        </SheetClose>
      ) : (
        <React.Fragment key={currentItem.route}>{LinkComponent}</React.Fragment>
      );
    });
  };

  return (
    <>{isDashboard ? renderNavLinks(dashNavLinks) : renderNavLinks(navLinks)}</>
  );
};

export default NavLinks;
