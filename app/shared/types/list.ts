export interface ShoppingList {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  budget?: number | null;
  itemCount?: number;
  isCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateShoppingListInput {
  name: string;
  description?: string;
  category?: string;
  budget?: number;
}

export interface UpdateShoppingListInput {
  name?: string;
  description?: string;
  category?: string;
  budget?: number;
  isCompleted?: boolean;
}