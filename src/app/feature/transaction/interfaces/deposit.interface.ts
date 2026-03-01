export interface Deposit {
  accountId : string;
  categoryId?: string;
  amount: number;
  date: string;
  note?: string;
  payer?: string;
}