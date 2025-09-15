import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 primary-dark-gradient text-white text-center px-6 m-8 rounded-lg">
      <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-light-850">
        Ready to Capture Your Next Event?
      </h2>
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
