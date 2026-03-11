export interface AccountBalanceComparison{
  currentMonth: MonthlySummary;
  previousMonth: MonthlySummary;
}

export interface MonthlySummary{
  year:number;
  month:number;
  income: number;
  expense:number;
}


