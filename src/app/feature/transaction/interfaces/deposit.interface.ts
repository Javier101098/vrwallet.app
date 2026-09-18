interface Operation {
  accountId: string;
  categoryId?: string;
  amount: number;
  date: Date | null;
  note?: string;
  payer?: string;
}

export interface Income extends Operation {}

export interface Expense extends Operation {}

export type Transfer = Omit<Operation, 'categoryId'> & {
  destinationAccountId: string;
};