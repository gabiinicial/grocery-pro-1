export interface Category {
  id: string;
  name: string;
  listId?: string;
  color?: string | null;
  createdAt?: string;
}

export interface CreateCategoryInput {
  name: string;
  color?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
}
