import {Account} from '../../account/interfaces/account.interface';
import {Category} from '@core/Interfaces/category.interface';

export interface Transaction {
  id: number;
  accountId: string;
  destinationAccountId?: string;
  amount: number;
  date: string;
  note?: string;
  payer?: string;
  createdAt: string;
  type: Type;
}

export type TransactionResponse = Omit<Transaction, 'accountId' | 'destinationAccountId'> & {
  account : Account
  destinationAccount?: Account
  category: Category
};

export enum Type {
  Income,
  Expense,
  Transfer,
  Yield,
}
