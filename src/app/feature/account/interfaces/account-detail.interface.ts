import {Account} from './account.interface';
import {AccountType} from '@core/Interfaces/account-type.interface';
import {Credit} from './credit.interface';
 import {Investment} from './investment.interface';

export type AccountDetail = Omit<Account, 'accountTypeId' | 'currencyId' | 'institutionId'> & {
  accountType: AccountType;
  credit?: Credit;
  investment: Investment
};

