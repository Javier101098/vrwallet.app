import {Frequency} from "./yield-frequency";
import {Credit} from "./credit.interface";

export interface CreateAccountRequest {
  accountTypeId: string;
  currencyId: string;
  institutionId: string;
  name: string;
  color: string;
  notes: string;
  investment?: InvestmentAccount;
  credit?: Credit;
}

export interface InvestmentAccount{
  frequency: Frequency;
  rate: number;
  maturityDate: string;
  retainsIsr: boolean;
  isCompound: boolean;
}
