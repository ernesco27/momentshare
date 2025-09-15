"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, ScrambleTextPlugin } from "gsap/all";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
const CTASection = () => {
  const isMobile = useMediaQuery({
    maxWidth: 768,
  });

  const ref = useRef(null);

  useGSAP(() => {
    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 70%",
          end: "bottom top",
        },
      })
      .from(ref.current, { autoAlpha: 0, ease: "linear" })
      .to(".p-h2", {
        scrambleText: {
          text: "Ready to Capture Your Next Event?",
          tweenLength: false,
          speed: 2,
          chars: "upperAndLowerCase",
          newClass: "!text-light-850",
        },
        duration: 2,
      });

    return () => {
      if (tl) tl.kill();
    };
  }, [isMobile]);
  return (
    <section
      ref={ref}
      className="py-20 primary-dark-gradient text-white text-center px-6 m-8 rounded-lg cta-section invisible"
    >
      <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-primary-950 p-h2 line-clamp-2"></h2>
      <p className="mb-6 text-lg lg:text-xl text-light-850">
        Join hundreds of organizers already preserving their best memories.
      </p>
      <Button
        size="lg"
        className="bg-primary-500 hover:primary-dark-gradient  hover:ring-primary-500 hover:ring-offset-2 transition-all duration-300 ease-in-out  text-white text-lg font-semibold hover:shadow-primary-500/50 hover:shadow-lg cursor-pointer"
      >
        Create Your Free Event
      </Button>
    </section>
  );
};

export default CTASection;
