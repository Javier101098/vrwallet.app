export interface Credit {
  id: string;
  creditLimit: number;
  creditAvailable: number;
  creditUsed: number;
  paymentDueDay: number;
  notifyPayment: boolean;
}

export type CreateCreditRequest = Omit<Credit, 'id'>;
