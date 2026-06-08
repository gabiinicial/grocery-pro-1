"use client";

import Link from "next/link";

export default function ItemListRedirect() {
  return (
    <div className="p-8 rounded-lg w-full flex flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-lg font-bold text-gray-700">Selecciona una lista</h2>
      <p className="text-sm text-gray-500">
        Para ver los ítems de una lista, selecciónala desde el inicio.
      </p>
      <Link
        href="/"
        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition text-sm font-medium"
      >
        Ir al inicio
      </Link>
    </div>
  );
}
