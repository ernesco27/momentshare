import Navbar from "@/components/navigation/Navbar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <section className="flex min-h-screen flex-1 flex-col px-6 py-36 max-md:pb-14 sm:px-14 ">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </section>
    </main>
  );
};

export default RootLayout;
