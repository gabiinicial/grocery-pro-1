"use client";

import { Loader2, Plus, Trash2, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getBudget, upsertBudget } from "../../../shared/services/budget.service";
import { getCategories } from "../../../shared/services/category.service";
import {
  createItem,
  deleteItem,
  getItems,
  updateItem,
} from "../../../shared/services/item.service";
import { getList } from "../../../shared/services/list.service";
import type { Budget } from "../../../shared/types/budget";
import type { Category } from "../../../shared/types/category";
import type { Item } from "../../../shared/types/item";
import type { ShoppingList } from "../../../shared/types/list";

type AddItemForm = { name: string; quantity: string; price: string; categoryId: string };
type BudgetForm = { amount: string };

export default function ListDetailPage() {
  const { listId } = useParams<{ listId: string }>();

  const [list, setList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register: regItem,
    handleSubmit: handleItem,
    reset: resetItem,
    formState: { isSubmitting: addingItem },
  } = useForm<AddItemForm>({ defaultValues: { name: "", quantity: "", price: "", categoryId: "" } });

  const {
    register: regBudget,
    handleSubmit: handleBudget,
    reset: resetBudget,
    formState: { isSubmitting: savingBudget },
  } = useForm<BudgetForm>({ defaultValues: { amount: "" } });

  useEffect(() => {
    if (!listId) return;
    Promise.all([
      getList(listId),
      getItems(listId),
      getCategories(listId),
      getBudget(listId).catch(() => null),
    ])
      .then(([listData, itemsData, catsData, budgetData]) => {
        setList(listData);
        setItems(itemsData);
        setCategories(catsData);
        setBudget(budgetData);
        if (budgetData?.amount) resetBudget({ amount: String(budgetData.amount) });
      })
      .catch(() => setError("No se pudo cargar la lista."))
      .finally(() => setLoading(false));
  }, [listId, resetBudget]);

  const handleToggleItem = async (item: Item) => {
    const updated = await updateItem(item.id, {
      isChecked: !item.isChecked,
      isPurchased: !item.isChecked,
    });
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleDeleteItem = async (itemId: string) => {
    setDeletingId(itemId);
    try {
      await deleteItem(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch {
      alert("No se pudo eliminar el ítem.");
    } finally {
      setDeletingId(null);
    }
  };

  const onAddItem = async (data: AddItemForm) => {
    const newItem = await createItem(listId, {
      name: data.name,
      ...(data.quantity && { quantity: Number(data.quantity) }),
      ...(data.price && { price: Number(data.price) }),
      ...(data.categoryId && { categoryId: data.categoryId }),
    });
    setItems((prev) => [...prev, newItem]);
    resetItem();
    setShowAddItem(false);
  };

  const onSaveBudget = async (data: BudgetForm) => {
    const saved = await upsertBudget(listId, { amount: Number(data.amount) });
    setBudget(saved);
    setShowBudget(false);
  };

  const spent = items
    .filter((i) => i.isChecked || i.isPurchased)
    .reduce((acc, i) => acc + (i.price ?? 0) * (i.quantity ?? 1), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full py-20">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="w-full py-10 text-center text-red-500 text-sm">
        {error ?? "Lista no encontrada."}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg w-full flex flex-col gap-6">
      {/* Header de la lista */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-700">{list.name}</h2>
          {list.description && (
            <p className="text-sm text-gray-500 mt-1">{list.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBudget(!showBudget)}
            className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-lg hover:bg-orange-200 transition"
          >
            Presupuesto
          </button>
          <button
            onClick={() => setShowAddItem(!showAddItem)}
            className="text-orange-700 hover:text-orange-900"
            aria-label="Agregar ítem"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Presupuesto */}
      {(showBudget || budget) && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Presupuesto</h3>
          {budget && (
            <div className="flex gap-4 text-sm text-gray-600 mb-3">
              <span>Total: <strong className="text-gray-800">${budget.amount?.toLocaleString()}</strong></span>
              <span>Gastado: <strong className="text-orange-600">${spent.toLocaleString()}</strong></span>
              <span>Restante: <strong className={budget.amount - spent < 0 ? "text-red-600" : "text-green-600"}>${(budget.amount - spent).toLocaleString()}</strong></span>
            </div>
          )}
          {showBudget && (
            <form onSubmit={handleBudget(onSaveBudget)} className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Monto del presupuesto"
                {...regBudget("amount", { required: true, min: 0 })}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button
                type="submit"
                disabled={savingBudget}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition disabled:opacity-70"
              >
                {savingBudget ? "Guardando..." : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => setShowBudget(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}

      {/* Formulario agregar ítem */}
      {showAddItem && (
        <form
          onSubmit={handleItem(onAddItem)}
          className="bg-slate-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-3"
        >
          <h3 className="text-sm font-semibold text-gray-700">Agregar ítem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nombre del producto*"
              {...regItem("name", { required: true })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <select
              {...regItem("categoryId")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              placeholder="Cantidad"
              {...regItem("quantity")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Precio"
              {...regItem("price")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => { setShowAddItem(false); resetItem(); }}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={addingItem}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition disabled:opacity-70"
            >
              {addingItem ? "Agregando..." : "Agregar"}
            </button>
          </div>
        </form>
      )}

      {/* Categorías */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c.id}
              className="bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-lg"
            >
              {c.name}
            </span>
          ))}
        </div>
      )}

      {/* Lista de ítems */}
      {items.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">
          No hay ítems. Agrega el primero con el botón +
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between bg-transparent px-2 py-3 rounded-lg shadow-sm border"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`item-${item.id}`}
                  checked={!!(item.isChecked || item.isPurchased)}
                  onChange={() => handleToggleItem(item)}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />
                <label
                  htmlFor={`item-${item.id}`}
                  className={`text-sm font-medium cursor-pointer ${
                    item.isChecked || item.isPurchased
                      ? "line-through text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                  {item.quantity && item.quantity > 1 && (
                    <span className="ml-1 text-gray-400 font-normal">x{item.quantity}</span>
                  )}
                  {item.price && (
                    <span className="ml-2 text-orange-500 font-normal">${item.price.toLocaleString()}</span>
                  )}
                </label>
              </div>

              <button
                onClick={() => handleDeleteItem(item.id)}
                disabled={deletingId === item.id}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
                aria-label="Eliminar ítem"
              >
                {deletingId === item.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
