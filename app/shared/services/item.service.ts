import { apiRequest } from "../lib/api-client";
import type { Item, CreateItemInput, UpdateItemInput } from "../types/item";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface BackendItem {
  id: string;
  listId: string;
  categoryId?: string | null;
  name: string;
  quantity: number;
  price: number;
  note?: string | null;
  purchased: boolean;
  purchasedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  category?: { id: string; name: string; color?: string | null; isDefault: boolean } | null;
}

function mapItem(b: BackendItem): Item {
  return {
    id: b.id,
    listId: b.listId,
    categoryId: b.categoryId,
    name: b.name,
    quantity: b.quantity,
    price: b.price,
    notes: b.note ?? undefined,
    isPurchased: b.purchased,
    isChecked: b.purchased,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
}

export async function getItems(listId: string, categoryId?: string): Promise<Item[]> {
  const query = categoryId ? `?categoryId=${categoryId}` : "";
  const res = await apiRequest<ApiResponse<BackendItem[]>>(`/api/lists/${listId}/items${query}`);
  return res.data.map(mapItem);
}

export async function getItem(itemId: string): Promise<Item> {
  const res = await apiRequest<ApiResponse<BackendItem>>(`/api/items/${itemId}`);
  return mapItem(res.data);
}

export async function createItem(listId: string, input: CreateItemInput): Promise<Item> {
  const res = await apiRequest<ApiResponse<BackendItem>>(`/api/lists/${listId}/items`, {
    method: "POST",
    body: {
      name: input.name,
      quantity: input.quantity,
      price: input.price,
      categoryId: input.categoryId,
      note: input.notes,
    },
  });
  return mapItem(res.data);
}

export async function updateItem(itemId: string, input: UpdateItemInput): Promise<Item> {
  const res = await apiRequest<ApiResponse<BackendItem>>(`/api/items/${itemId}`, {
    method: "PATCH",
    body: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.quantity !== undefined && { quantity: input.quantity }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
      ...(input.notes !== undefined && { note: input.notes }),
      ...((input.isPurchased !== undefined || input.isChecked !== undefined) && {
        purchased: input.isPurchased ?? input.isChecked,
      }),
    },
  });
  return mapItem(res.data);
}

export async function deleteItem(itemId: string): Promise<void> {
  await apiRequest<ApiResponse<null>>(`/api/items/${itemId}`, {
    method: "DELETE",
  });
}
