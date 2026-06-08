export interface Budget {
  id?: string;
  listId: string;
  amount: number;
  spent?: number;
  remaining?: number;
  currency?: string;
}

export interface BudgetInput {
  amount: number;
  currency?: string;
}
