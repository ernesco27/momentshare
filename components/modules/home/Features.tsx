"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { QrCode, Users, Shield, Clock } from "lucide-react";
import { useMediaQuery } from "react-responsive";

import FeatureCard from "@/components/cards/FeatureCard";
import Container from "@/components/Container";

const feaures = [
  {
    heading: "QR Code Magic",
    description:
      "Generate unique QR codes for each event. Attendees scan and upload instantly.",
    icon: QrCode,
  },
  {
    heading: "Easy Sharing",
    description:
      "No apps needed. Anyone can upload photos directly from their phone's camera.",
    icon: Users,
  },
  {
    heading: "Privacy First",
    description:
      "All photos are private to the event organizer. Auto-delete after expiry.",
    icon: Shield,
  },
  {
    heading: "Temporary Storage",
    description:
      "Photos auto-delete after your chosen timeframe for complete privacy.",
    icon: Clock,
  },
];

gsap.registerPlugin(ScrollTrigger);
const Features = () => {
  const isMobile = useMediaQuery({
    maxWidth: 768,
  });

  useGSAP(() => {
    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: ".feature",
          start: "top 50%",
          end: "bottom top",
        },
      })
      .from("#feature-card", {
        yPercent: 100,
        opacity: 0,
        ease: "back",
        duration: 1,
        stagger: {
          amount: 0.2,
          from: "center",
        },
      });

    return () => {
      if (tl) tl.kill();
    };
  }, [isMobile]);

  return (
    <Container>
      <div className="feature flex-center flex-wrap gap-8  p-8 lg:mt-10">
        {feaures.map((feature, index) => (
          <div id="feature-card" key={index}>
            <FeatureCard {...feature} />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Features;
