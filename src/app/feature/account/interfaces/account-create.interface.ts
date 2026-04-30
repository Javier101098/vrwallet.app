import {Frequency} from "./yield-frequency";

export interface AccountCreate {
  accountTypeId: string;
  currencyId: string;
  institutionId: string;
  name: string;
  color: string;
  note: string;
  investment?: InvestmentAccount;
}

export interface InvestmentAccount{
  frequency: Frequency;
  rate: number;
  maturityDate: string;
  retainsIsr: boolean;
  isCompound: boolean;
}