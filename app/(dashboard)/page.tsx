"use client";

import { EllipsisVertical, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useApp } from "../shared/context/app-context";
import { deleteList } from "../shared/services/list.service";

export default function Home() {
  const { lists, listsLoading, refreshLists } = useApp();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (listId: string, listName: string) => {
    if (!confirm(`¿Eliminar la lista "${listName}"?`)) return;
    setDeletingId(listId);
    try {
      await deleteList(listId);
      await refreshLists();
    } catch {
      alert("No se pudo eliminar la lista. Intenta de nuevo.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="flex flex-col gap-4 w-full">
      <div className="bg-orange-500 text-white overflow-hidden relative rounded-lg p-4 flex items-center justify-between shadow-md w-full">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Organiza tu lista y gana en tus compras
          </h2>
          <div className="flex gap-2">
            <Link href="/create">
              <button className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-100 transition">
                Crear Lista
              </button>
            </Link>
          </div>
        </div>
        <div className="hidden md:block h-24 w-72 rounded-full bg-white/15 blur-3xl" />
      </div>

      <div className="bg-orange-50 rounded-lg">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Tus listas</h2>

        {listsLoading && (
          <div className="flex items-center gap-2 text-gray-500 py-6 justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
            <span className="text-sm">Cargando listas...</span>
          </div>
        )}

        {!listsLoading && lists.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            <p>No tienes listas aún.</p>
            <Link href="/create" className="text-orange-500 hover:underline font-medium mt-1 inline-block">
              Crea tu primera lista
            </Link>
          </div>
        )}

        {!listsLoading && lists.length > 0 && (
          <ul className="space-y-4">
            {lists.map((list) => (
              <li
                key={list.id}
                className="flex items-center justify-between bg-slate-100 p-4 rounded-lg shadow-sm"
              >
                <span className="text-gray-700 text-sm font-medium truncate mr-2">
                  {list.name}
                </span>

                <div className="flex items-center gap-3 shrink-0">
                  {list.category && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-4 py-1 rounded-lg">
                      {list.category}
                    </span>
                  )}

                  <button
                    onClick={() => handleDelete(list.id, list.name)}
                    disabled={deletingId === list.id}
                    className="text-red-400 hover:text-red-600 disabled:opacity-50"
                    aria-label="Eliminar lista"
                  >
                    {deletingId === list.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>

                  <Link
                    href={`/lists/${list.id}`}
                    className="text-orange-700 hover:text-orange-900"
                    aria-label="Ver lista"
                  >
                    <EllipsisVertical size={24} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
