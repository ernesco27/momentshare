import Image from "next/image";
import { ReactNode } from "react";

import SocialAuthForm from "@/components/forms/SocialAuthForm";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex-center min-h-screen dark:bg-auth-dark bg-cover bg-center bg-no-repeat bg-auth-light px-4 py-10">
      <section className="light-border background-light800_dark200 shadow-light100_dark100 min-w-full rounded-[10px] border px-4 py-10 shadow-md sm:min-w-[520px] sm:px-8">
        <div className="flex-between gap-2">
          <div className="space-y-2.5">
            <h1 className="h2-bold text-dark100_light900 ">
              Join Moment Share
            </h1>
            <p className="paragraph-regular text-dark500_light400">
              To relive the moments that matter
            </p>
          </div>
          <Image
            src="/images/Logo.svg"
            width={150}
            height={150}
            alt="Moment Share logo"
          />
        </div>
        {children}
        <SocialAuthForm />
      </section>
    </main>
  );
};

export default AuthLayout;
