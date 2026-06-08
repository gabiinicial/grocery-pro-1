"use client";

import { Loader2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useApp } from "../../shared/context/app-context";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../../shared/services/category.service";
import type { Category } from "../../shared/types/category";

type AddCategoryForm = { name: string };

export default function CategoriesPage() {
  const { lists } = useApp();
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AddCategoryForm>({ defaultValues: { name: "" } });

  useEffect(() => {
    if (!selectedListId) {
      setCategories([]);
      return;
    }
    setLoading(true);
    setError(null);
    getCategories(selectedListId)
      .then(setCategories)
      .catch(() => setError("No se pudieron cargar las categorías."))
      .finally(() => setLoading(false));
  }, [selectedListId]);

  const onAdd = async (data: AddCategoryForm) => {
    if (!selectedListId) return;
    try {
      const created = await createCategory(selectedListId, { name: data.name });
      setCategories((prev) => [...prev, created]);
      reset();
      setShowForm(false);
    } catch {
      alert("No se pudo crear la categoría.");
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    setDeletingId(categoryId);
    try {
      await deleteCategory(categoryId);
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } catch {
      alert("No se pudo eliminar la categoría.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-orange-50 min-h-screen w-full rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-700">Categorías</h2>
        {selectedListId && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-orange-700 hover:text-orange-900"
            aria-label="Agregar categoría"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Selector de lista */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Selecciona una lista para ver sus categorías
        </label>
        <select
          value={selectedListId}
          onChange={(e) => setSelectedListId(e.target.value)}
          className="block w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          <option value="">-- Selecciona una lista --</option>
          {lists.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      {/* Formulario nueva categoría */}
      {showForm && selectedListId && (
        <form
          onSubmit={handleSubmit(onAdd)}
          className="bg-white border border-orange-200 rounded-lg p-4 mb-6 flex gap-2 items-center"
        >
          <input
            type="text"
            placeholder="Nombre de la categoría"
            {...register("name", { required: true })}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition disabled:opacity-70"
          >
            {isSubmitting ? "..." : "Agregar"}
          </button>
          <button
            type="button"
            onClick={() => { setShowForm(false); reset(); }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {!selectedListId && (
        <p className="text-gray-400 text-sm text-center py-10">
          Selecciona una lista para gestionar sus categorías.
        </p>
      )}

      {selectedListId && (
        <>
          {/* Búsqueda */}
          <div className="flex items-center mb-8 md:w-3/5">
            <input
              type="text"
              placeholder="Categoría"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            />
            <button className="bg-orange-500 text-white px-4 py-2 rounded-r-lg hover:bg-orange-600 transition">
              Buscar
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-10 gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
              <span className="text-sm">Cargando categorías...</span>
            </div>
          )}

          {!loading && error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-6">
              No hay categorías aún. Agrega la primera con el botón +
            </p>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="mb-8">
                <h3 className="text-md font-semibold text-gray-700 mb-4">
                  Tus categorías populares
                </h3>
                <div className="flex flex-wrap gap-4">
                  {filtered.slice(0, 5).map((category) => (
                    <div
                      key={category.id}
                      className="bg-orange-500 text-white px-6 py-4 rounded-lg shadow-md flex items-center gap-2"
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-md font-semibold text-gray-700 mb-4">
                  Todas las categorías
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filtered.map((category) => (
                    <div
                      key={category.id}
                      className="bg-yellow-100 text-orange-500 border border-yellow-300 px-4 py-2 rounded-lg text-center font-medium shadow-sm hover:bg-yellow-200 transition flex items-center justify-between gap-1"
                    >
                      <span className="truncate text-sm">{category.name}</span>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deletingId === category.id}
                        className="text-red-400 hover:text-red-600 shrink-0"
                        aria-label="Eliminar"
                      >
                        {deletingId === category.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
