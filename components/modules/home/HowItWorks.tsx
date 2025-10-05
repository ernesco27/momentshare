"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useMediaQuery } from "react-responsive";

import HowToCard from "@/components/cards/HowToCard";
import Container from "@/components/Container";

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const steps = [
    {
      heading: "Create Event",
      description:
        " Organizers generate a unique QR code for their event in seconds.",
      no: 1,
    },
    {
      heading: "Guests Upload",
      description: "Attendees scan the QR code and upload photos and videos.",
      no: 2,
    },
    {
      heading: "Relive Memories",
      description:
        "Organizers view all the shared moments, even the ones they missed.",
      no: 3,
    },
  ];

  const isMobile = useMediaQuery({
    maxWidth: 768,
  });

  useGSAP(() => {
    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: ".howTo",
          start: "top 50%",
          end: "bottom top",
        },
      })
      .from("#howTo-card", {
        opacity: 0,
        ease: "none",
        duration: 1,
        stagger: {
          each: 0.2,
          from: "start",
        },
      });

    return () => {
      if (tl) tl.kill();
    };
  }, [isMobile]);

  return (
    <Container>
      <section className="py-16 px-6 howTo">
        <h2 className="text-4xl font-bold text-center mb-12 primary-text-gradient">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div id="howTo-card" key={index}>
              <HowToCard key={index} {...step} />
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
};

export default HowItWorks;
