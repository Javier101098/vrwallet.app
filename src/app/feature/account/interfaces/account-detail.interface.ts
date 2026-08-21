import {Account} from './account.interface';
import {AccountType} from '@core/Interfaces/account-type.interface';
import {CreditDetail} from './credit-detail';

export type AccountDetail = Omit<Account, 'accountTypeId' | 'currencyId' | 'institutionId'> & {
  accountType: AccountType;
  creditDetail?: CreditDetail;
};

