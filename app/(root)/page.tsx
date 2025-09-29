import Footer from "@/components/modules/footer/Footer";
import CTASection from "@/components/modules/home/CTASection";
import Features from "@/components/modules/home/Features";
import Hero from "@/components/modules/home/Hero";
import HowItWorks from "@/components/modules/home/HowItWorks";
import PriceSection from "@/components/modules/home/PriceSection";

export default function Home() {
  return (
    <section>
      <Hero />
      <Features />
      <HowItWorks />
      <PriceSection />
      <CTASection />
      <Footer />
    </section>
  );
}
