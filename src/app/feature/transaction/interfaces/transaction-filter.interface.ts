export interface TransactionFilter {
  accountId?: string | null;
  from?: Date | null;
  to?: Date | null;
  categoryId?: string | null;
  amount?: number | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  page?: number | null;
  limit?: number | null;
}
