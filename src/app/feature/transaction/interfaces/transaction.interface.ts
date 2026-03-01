export interface Transaction{
  id: number;
  amount: number;
  date: string;
  note?: string;
  payer?: string;
  createdAt: string;
}

