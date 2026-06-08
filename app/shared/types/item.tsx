export interface Item {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  price?: number;
  isChecked?: boolean;
  isPurchased?: boolean;
  categoryId?: string | null;
  listId?: string;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateItemInput {
  name: string;
  quantity?: number;
  unit?: string;
  price?: number;
  categoryId?: string;
  notes?: string;
}

export interface UpdateItemInput {
  name?: string;
  quantity?: number;
  unit?: string;
  price?: number;
  isChecked?: boolean;
  isPurchased?: boolean;
  categoryId?: string | null;
  notes?: string | null;
}
