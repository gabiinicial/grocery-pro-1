import { AppProvider } from "../shared/context/app-context";
import AuthGate from "../shared/components/AuthGate";
import Header from "../shared/components/Header";
import Sidebar from "../shared/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <AuthGate>
        <section className="w-full flex flex-col items-center">
          <Header />
          <div className="flex m-4 justify-center gap-6 w-full max-w-6xl ">
            <Sidebar />
            {children}
          </div>
        </section>
      </AuthGate>
    </AppProvider>
  );
}
