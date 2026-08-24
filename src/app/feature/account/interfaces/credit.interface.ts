export interface Credit {
  creditLimit: number;
  creditAvailable: number;
  creditUsed: number;
  paymentDueDay: number;
  notifyPayment: boolean;
}
