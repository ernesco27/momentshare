import Footer from "@/components/modules/footer/Footer";
import CTASection from "@/components/modules/home/CTASection";
import Features from "@/components/modules/home/Features";
import Hero from "@/components/modules/home/Hero";
import HowItWorks from "@/components/modules/home/HowItWorks";
import PriceSection from "@/components/modules/home/PriceSection";
import { getPlans } from "@/lib/actions/plan.action";

export const Home = async () => {
  const { data: plans } = await getPlans();

  return (
    <section>
      <Hero />
      <Features />
      <HowItWorks />
      <PriceSection plans={plans!} />
      <CTASection />
      <Footer />
    </section>
  );
};

export default Home;
