import {Frequency} from './yield-frequency';

export interface Investment {
  id: string;
  frequency: Frequency;
  rate: number;
  maturityDate: string;
  retainsIsr: boolean;
  isCompound: boolean;
}

export type CreateInvestmentRequest = Omit<Investment, 'id'>;
