import {Account} from './account.interface';
import {AccountType} from '@core/Interfaces/account-type.interface';

export type AccountDetail = Omit<Account, 'accountTypeId' | 'currencyId' | 'institutionId'> & {
  accountType: AccountType;
};
