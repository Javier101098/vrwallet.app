export interface AccountSummary {
  id: string;
  name: string;
  accountNumber: string;
  color: string;
  balance: number;
  isInvestment?: boolean;
  currentMonth: MonthlySummary;
  previousMonth: MonthlySummary;
}

export interface MonthlySummary {
  year: number;
  month: number;
  income: number;
  expense: number;
}
