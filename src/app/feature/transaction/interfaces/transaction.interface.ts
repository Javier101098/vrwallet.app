export interface Transaction {
  id: number;
  accountId: string;
  destinationAccountId?: string;
  amount: number;
  date: string;
  note?: string;
  payer?: string;
  createdAt: string;
  type: Type;
}

export enum Type {
  Income,
  Expense,
  Transfer,
  Yield,
}
