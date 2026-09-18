export interface TransactionFilterRequest {
  accountId?: string | null;
  from?: Date | null | string;
  to?: Date | null | string;
  categoryId?: string | null;
  amount?: number | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  page?: number | null;
  limit?: number | null;
  type: string | null;
}
