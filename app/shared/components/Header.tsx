import { Bell, CircleUser } from "lucide-react";
import logoWeb from "../../public/logo.svg";
import Image from "next/image";
import Link from "next/link";
export default function Header() {
  return (
    <header className="bg-orange-100  px-6 py-2 shadow-sm w-full flex justify-center">
      {/* Logo */}
      <div className="w-full max-w-6xl flex justify-between items-center">
        <Image
          src={logoWeb}
          width={500}
          height={500}
          className="w-20 h-auto"
          alt={"Logo"}
        />

        {/* Icons */}
        <div className="flex items-center gap-2">
          {/* Notification Icon */}
          <Link href="/notification">
            <Bell size={30} className="text-amber-950" />
          </Link>
          {/* User Icon */}
          <span className="p-1.5 rounded-full bg-orange-600">
            <CircleUser size={24} className="text-white" />
          </span>
        </div>
      </div>
    </header>
  );
}
