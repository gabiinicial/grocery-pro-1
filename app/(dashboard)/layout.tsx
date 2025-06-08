import Header from "../shared/components/Header";
import Sidebar from "../shared/components/Sidebar";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full flex flex-col items-center">
      {/* Include shared UI here e.g. a header or sidebar */}
      <Header />
      <div className="flex m-4 justify-center gap-6 w-full max-w-6xl ">
        <Sidebar />

        {children}
      </div>
    </section>
  );
}
