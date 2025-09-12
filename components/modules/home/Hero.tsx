"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
// import { auth } from "@/auth";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Hero = () => {
  // const session = await auth();
  // const userId = session?.user?.id;

  const ref = useRef(null);

  const session = useSession();
  const userId = session.data?.user?.id;

  const isMobile = useMediaQuery({
    maxWidth: 768,
  });

  useGSAP(() => {
    const paraSplit = new SplitText(".subtitle", { type: "lines" });

    const tl = gsap.timeline({ defaults: { ease: "back", opacity: 0 } });

    gsap.to("#layer3", {
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      attr: {
        d: "M160,0 C190,90 170,210 160,310 C150,410 190,510 160,600 L300,600 L300,0 Z",
      },
    });

    // Middle layer
    gsap.to("#layer2", {
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1,
      attr: {
        d: "M170,0 C200,130 220,230 170,330 C150,430 220,530 170,600 L300,600 L300,0 Z",
      },
    });

    // Top layer
    gsap.to("#layer1", {
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2,
      attr: {
        d: "M180,0 C210,90 205,190 180,280 C160,380 210,480 180,600 L300,600 L300,0 Z",
      },
    });

    tl.from(ref.current, { autoAlpha: 0, ease: "linear" })
      .from(".header-1", { x: 120, duration: 1 })
      .from(".header-2", { x: -120, duration: 1 }, "<")
      .from(
        paraSplit.lines,
        {
          yPercent: 100,
          duration: 1.8,
          ease: "expo.out",
          stagger: 0.06,
        },
        "-=0.2"
      )
      .from(".cta", { y: 30, duration: 0.8 }, "-=0.6");

    return () => {
      if (tl) tl.kill();
    };
  }, [isMobile]);

  return (
    <main
      ref={ref}
      className="relative min-h-screen py-32 lg:px-28 overflow-hidden invisible  hero"
    >
      <div className="absolute inset-0 z-0 top-0 right-0">
        <div className="relative w-full">
          <svg
            viewBox="0 0 300 600"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            id="waves"
            className="relative top-0 right-0 max-h-screen"
          >
            <path
              id="layer3"
              d="M160,0 C180,100 170,200 160,300 C150,400 180,500 160,600 L300,600 L300,0 Z"
            />

            <path
              id="layer2"
              d="M160,0 C180,100 170,200 160,300 C150,400 180,500 160,600 L300,600 L300,0 Z"
              transform="scale(1,-1) translate(0,-600)"
            />

            <path
              id="layer1"
              d="M170,0 C190,80 180,180 170,260 C160,360 190,460 170,600 L300,600 L300,0 Z"
            />
          </svg>
        </div>
      </div>
      <div className="w-[450px] h-[650px]  absolute lg:top-[15%] min-md:bottom-0 right-0 z-10 max-sm:hidden">
        <Image src="/images/couple.png" alt="image of couple" fill />
      </div>
      <div className="flex flex-col justify-center p-8 lg:p-12">
        <h2 className="text-dark200_light900 text-6xl max-lg:text-5xl font-bold mb-6 header-1">
          Relive Every Moment
        </h2>
        <h3 className="text-6xl max-lg:text-5xl font-bold mb-6 primary-text-gradient header-2">
          Even the Ones You Missed!
        </h3>
        <p className="text-xl md:text-2xl text-dark400_light700 mb-8 max-w-md lg:max-w-3xl subtitle">
          From laughter to behind-the-scenes magic — let your guests capture and
          share the authentic moments you might have missed. All in one simple,
          temporary photobook.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 cta">
          <Link href="/dashboard">
            <Button size="lg" className="bg-primary-500 text-xl text-white ">
              {userId ? "Go to Dashboard" : "Start Collecting Memories"}
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Hero;
