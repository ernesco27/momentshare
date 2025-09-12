import { QrCode, Users, Shield, Clock } from "lucide-react";

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

const Features = () => {
  return (
    <Container>
      <div className="flex-center flex-wrap gap-8  p-8 lg:mt-10">
        {feaures.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </Container>
  );
};

export default Features;
