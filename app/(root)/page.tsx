import Features from "@/components/modules/home/Features";
import Hero from "@/components/modules/home/Hero";
import HowItWorks from "@/components/modules/home/HowItWorks";
import PriceSection from "@/components/modules/home/PriceSection";

export default function Home() {
  return (
    <section className="">
      <Hero />
      <Features />
      <HowItWorks />
      <PriceSection />
    </section>
  );
}
