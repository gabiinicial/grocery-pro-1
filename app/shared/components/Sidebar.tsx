// components/Sidebar.tsx
"use client";
import { Home, FileText, List, Bell, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const [isListOpen, setIsListOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("auth"); // Eliminar el estado de autenticación
    router.push("/login"); // Redirigir a la página de login
  };

  const toggleList = () => {
    setIsListOpen(!isListOpen);
  };

  return (
    <aside className="bg-orange-900 text-white h-[89vh] w-60 flex flex-col justify-between p-3 rounded-2xl">
      {/* Menu Items */}
      <nav className="flex flex-col gap-3 w-full">
        {/* Inicio */}
        <Link href="/">
          <div className="flex items-center space-x-3 bg-orange-700 rounded-lg px-4 py-2 cursor-pointer">
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">Inicio</span>
          </div>
        </Link>

        {/* Categorías */}
        <Link href="/category">
          <div className="flex items-center space-x-3 px-4 py-2 cursor-pointer hover:bg-orange-800 rounded-lg">
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">Categorías</span>
          </div>
        </Link>

        {/* Listas */}
        <div className="">
          <Link href="/item-list">
            <div
              className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-orange-800 rounded-lg"
              onClick={toggleList}
            >
              <div className="flex items-center space-x-3">
                <List className="w-5 h-5" />
                <span className="text-sm font-medium">Listas</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transform ${
                  isListOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </Link>
          {isListOpen && (
            <div className="ml-5  border-l broder-1 border-slate-200">
              <Link href="/create">
                <div className="flex items-center space-x-3 px-4 ml-1 py-2 cursor-pointer hover:bg-orange-800 rounded-lg">
                  <span className="text-sm font-medium">Crear Lista</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Notificaciones */}
        <Link href="/notification">
          <div className="flex items-center space-x-3 px-4 py-2 cursor-pointer hover:bg-orange-800 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="text-sm font-medium">Notificaciones</span>
          </div>
        </Link>
      </nav>

      {/* Cerrar Sesión */}
      <div
        onClick={handleLogout}
        className="flex items-center space-x-3 px-4 py-2 cursor-pointer hover:bg-orange-800 rounded-lg"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">Cerrar Sesión</span>
      </div>
    </aside>
  );
}
