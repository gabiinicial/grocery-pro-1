"use client";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem("auth") === "true";
    console.log(isAuthenticated);

    if (!isAuthenticated) {
      // Redirigir a /login si no está autenticado
      router.replace("/login");
    }
  }, [router]);

  const lists = [
    { title: "Compra para limpieza", tag: "limpieza" },
    { title: "Compra para limpieza", tag: "limpieza" },
    { title: "Compra para limpieza", tag: "limpieza" },
    { title: "Compra para limpieza", tag: "limpieza" },
    { title: "Compra para limpieza", tag: "limpieza" },
  ];
  return (
    <main className="flex flex-col gap-4 w-full">
      <div className="bg-orange-500 text-white overflow-hidden relative rounded-lg p-4 flex items-center justify-between shadow-md w-full">
        {/* Texto Promocional */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Organiza tu lista y gana en tus compras
          </h2>
          <div className="flex gap-2">
            {/* Botón Crear Lista */}
            <Link href="/create">
              <button className="bg-white text-orange-500  px-4 py-2 rounded-lg font-medium hover:bg-orange-100 transition">
                Crear Lista
              </button>
            </Link>
            {/* Botón Regístrate */}
          </div>
        </div>

        {/* Imagen */}
        <div className="hidden md:block">
          <Image
            src="/notes.png"
            alt="Lista de compras"
            width={330}
            height={340}
            className="w-72 h-auto absolute right-0 top-0 "
          />
        </div>
      </div>
      <div className=" bg-orange-50 rounded-lg">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Tus listas</h2>
        <ul className="space-y-4">
          {lists.map((list, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-slate-100 p-4 rounded-lg shadow-sm"
            >
              {/* Título de la lista */}
              <span className="text-gray-700 text-sm font-medium">
                {list.title}
              </span>

              {/* Etiqueta */}
              <div className="flex gap-3">
                <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-4 py-1 rounded-lg">
                  {list.tag}
                </span>

                {/* Ícono de más opciones */}
                <button
                  className="text-orange-700 hover:text-orange-900"
                  aria-label="Más opciones"
                >
                  <Link href="/item-list">
                    <EllipsisVertical size={24} />
                  </Link>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
