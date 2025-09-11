import Navbar from "@/components/navigation/Navbar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <section className="flex min-h-screen flex-1 flex-col">
        <div className="">{children}</div>
      </section>
    </main>
  );
};

export default RootLayout;
