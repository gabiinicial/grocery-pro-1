import { apiRequest } from "../lib/api-client";
import type { ShoppingList, CreateShoppingListInput, UpdateShoppingListInput } from "../types/list";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getLists(): Promise<ShoppingList[]> {
  const res = await apiRequest<ApiResponse<ShoppingList[]>>("/api/lists");
  return res.data;
}

export async function getList(listId: string): Promise<ShoppingList> {
  const res = await apiRequest<ApiResponse<ShoppingList>>(`/api/lists/${listId}`);
  return res.data;
}

export async function createList(input: CreateShoppingListInput): Promise<ShoppingList> {
  const res = await apiRequest<ApiResponse<ShoppingList>>("/api/lists", {
    method: "POST",
    body: input,
  });
  return res.data;
}

export async function updateList(listId: string, input: UpdateShoppingListInput): Promise<ShoppingList> {
  const res = await apiRequest<ApiResponse<ShoppingList>>(`/api/lists/${listId}`, {
    method: "PATCH",
    body: input,
  });
  return res.data;
}

export async function deleteList(listId: string): Promise<void> {
  await apiRequest<ApiResponse<null>>(`/api/lists/${listId}`, {
    method: "DELETE",
  });
}
