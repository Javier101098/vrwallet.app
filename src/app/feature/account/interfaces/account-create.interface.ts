import {CreateCreditRequest} from "./credit.interface";
import {CreateInvestmentRequest} from './investment.interface';

export interface CreateAccountRequest {
  accountTypeId: string;
  currencyId: string;
  institutionId: string;
  name: string;
  color: string;
  notes: string;
  investment?: CreateInvestmentRequest;
  credit?: CreateCreditRequest;
}
