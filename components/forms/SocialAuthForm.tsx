"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import React from "react";
import { toast } from "sonner";

import ROUTES from "@/constants/route";

import { Button } from "../ui/button";

const SocialAuthForm = () => {
  const btnClass =
    "background-dark400_light900 cursor-pointer body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5";

  const handleSignIn = async (provider: "google") => {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.DASHBOARD,
        // redirect: false,
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during sign-in."
      );
    }
  };

  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button className={btnClass} onClick={() => handleSignIn("google")}>
        <Image
          src="/icons/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain"
        />
        <span>Log In With Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
