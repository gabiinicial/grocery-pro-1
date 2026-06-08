"use client";

import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { hasAuthSession } from "../lib/auth-storage";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!hasAuthSession()) {
      router.replace("/login");
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-orange-600" />
          <ShieldCheck className="h-5 w-5 text-orange-600" />
          Verificando acceso...
        </div>
      </div>
    );
  }

  return children;
}