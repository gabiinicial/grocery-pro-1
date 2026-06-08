import { apiRequest } from "../lib/api-client";
import type { Budget, BudgetInput } from "../types/budget";

interface BackendBudget {
  id?: string;
  listId: string;
  totalLimit: number | null;
  calculatedTotal: number;
  currency: string;
  status: string;
}

interface BackendBudgetResponse {
  budget: BackendBudget;
  summary: { remaining: number | null };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function mapBudget(data: BackendBudgetResponse): Budget {
  return {
    id: data.budget.id,
    listId: data.budget.listId,
    amount: data.budget.totalLimit ?? 0,
    spent: data.budget.calculatedTotal,
    remaining: data.summary.remaining ?? undefined,
    currency: data.budget.currency,
  };
}

export async function getBudget(listId: string): Promise<Budget> {
  const res = await apiRequest<ApiResponse<BackendBudgetResponse>>(`/api/lists/${listId}/budget`);
  return mapBudget(res.data);
}

export async function upsertBudget(listId: string, input: BudgetInput): Promise<Budget> {
  const res = await apiRequest<ApiResponse<BackendBudgetResponse>>(`/api/lists/${listId}/budget`, {
    method: "PUT",
    body: { totalLimit: input.amount, currency: input.currency },
  });
  return mapBudget(res.data);
}
