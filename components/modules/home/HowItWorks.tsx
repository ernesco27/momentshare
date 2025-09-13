import HowToCard from "@/components/cards/HowToCard";

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

  return (
    <section className="py-16 px-6">
      <h2 className="text-4xl font-bold text-center mb-12 primary-text-gradient">
        How It Works
      </h2>
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {/* <div className="p-6 rounded-2xl text-center background-dark400_light900 shadow-md">
          <h3 className="text-xl font-semibold mb-3">1. Create Event</h3>
          <p className="text-gray-600">
            Organizers generate a unique QR code for their event in seconds.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-md text-center">
          <h3 className="text-xl font-semibold mb-3">2. Guests Upload</h3>
          <p className="text-gray-600">
            Attendees scan the QR code and upload photos and videos instantly.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-md text-center">
          <h3 className="text-xl font-semibold mb-3">3. Relive Memories</h3>
          <p className="text-gray-600">
            Organizers view all the shared moments, even the ones they missed.
          </p>
        </div> */}
        {steps.map((step, index) => (
          <HowToCard key={index} {...step} />
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
