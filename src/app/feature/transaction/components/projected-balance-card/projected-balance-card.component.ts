import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {CurrencyPipe, PercentPipe} from "@angular/common";
import {Type} from "../../interfaces/transaction.interface";
import {AccountDetail} from '../../../account/interfaces/account-detail.interface';

@Component({
  selector: 'vrw-projected-balance-card',
  imports: [
    CurrencyPipe,
    PercentPipe
  ],
  templateUrl: './projected-balance-card.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectedBalanceCardComponent {
  account = input.required<AccountDetail|null>();
  amount = input<number>(0);
  type = input<Type>(Type.Income);

  currentBalance = computed<number>(()=> {
    return this.account()?.balance ?? 0;
  })

  projectedBalance = computed<number>(()=> {
    switch (this.type()){
      case Type.Income:
        return this.currentBalance() + this.amount();
      case Type.Expense:
      case Type.Transfer:
        return this.currentBalance() - this.amount();
      default:
        return 0;
    }
  })

  percentageDifference = computed<number>(()=> {
    const current = this.currentBalance();
    const amount = this.amount();
    const percentage  = (amount/current) ;

    switch (this.type()){
      case Type.Income:
        return percentage;
      case Type.Expense:
      case Type.Transfer:
        return -percentage;
      default:
        return 0;
    }
  })

}
