export interface AccountSummaryResponse {
  id: string;
  name: string;
  accountNumber: string;
  color: string;
  balance: number;
  isInvestment?: boolean;
  monthlyYield?: MonthlyYield;
  currentMonth: MonthlySummary;
  previousMonth: MonthlySummary;
}

export interface MonthlySummary {
  year: number;
  month: number;
  income: number;
  expense: number;
}

export interface MonthlyYield {
  current: number;
  previous: number;
}
