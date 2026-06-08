import { apiRequest } from "../lib/api-client";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "../types/category";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getCategories(listId: string): Promise<Category[]> {
  const res = await apiRequest<ApiResponse<Category[]>>(`/api/lists/${listId}/categories`);
  return res.data;
}

export async function createCategory(listId: string, input: CreateCategoryInput): Promise<Category> {
  const res = await apiRequest<ApiResponse<Category>>(`/api/lists/${listId}/categories`, {
    method: "POST",
    body: input,
  });
  return res.data;
}

export async function updateCategory(categoryId: string, input: UpdateCategoryInput): Promise<Category> {
  const res = await apiRequest<ApiResponse<Category>>(`/api/categories/${categoryId}`, {
    method: "PATCH",
    body: input,
  });
  return res.data;
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await apiRequest<ApiResponse<null>>(`/api/categories/${categoryId}`, {
    method: "DELETE",
  });
}
