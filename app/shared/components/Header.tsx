"use client";

import { Bell, CircleUser } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logoWeb from "/public/logo.svg";
import { useApp } from "../context/app-context";

export default function Header() {
  const { notificationCount } = useApp();

  return (
    <header className="bg-orange-100 px-6 py-2 shadow-sm w-full flex justify-center">
      <div className="w-full max-w-6xl flex justify-between items-center">
        <Image
          src={logoWeb}
          width={500}
          height={500}
          className="w-20 h-auto"
          alt={"Logo"}
        />

        <div className="flex items-center gap-2">
          <Link href="/notification" className="relative">
            <Bell size={30} className="text-amber-950" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </Link>
          <span className="p-1.5 rounded-full bg-orange-600">
            <CircleUser size={24} className="text-white" />
          </span>
        </div>
      </div>
    </header>
  );
}
