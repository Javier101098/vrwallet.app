import {YieldFrequency} from "./yield-frequency";

export interface AccountCreate {
  name: string;
  accountTypeId: string;
  currencyId: string;
  institutionId: string;
  color: string;
  note: string;
  yieldFrequency?: YieldFrequency;
  yieldRate?: number;
  isIsrRetention?: boolean;
  isCompoundInterest?: boolean;
  dueDate?: string;
}