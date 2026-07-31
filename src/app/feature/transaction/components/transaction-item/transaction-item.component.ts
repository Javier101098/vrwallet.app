import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {TransactionResponse, Type} from '../../interfaces/transaction.interface';
import {CurrencyPipe, DatePipe} from '@angular/common';

@Component({
  selector: 'vrw-transaction-item',
  imports: [
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './transaction-item.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionItemComponent {
  public readonly transaction = input.required<TransactionResponse>();

  note= computed<string>(() => {
    switch (this.transaction().note) {
      case '':
        return 'Sin descripción';
      default:
        return this.transaction().note || 'Sin descripción';
    }
  });

  bgColor = computed<string>(() => {
    return this.transaction().account.color
  })

  textColor = computed(()=>{
    return this.bgColor() === '#ffffff' ? '#000000' : '#ffffff'
  })

  operationSign= computed<string>(() => {
    switch (this.transaction().type) {
      case Type.Income:
        return '+';
      case Type.Expense:
        return '-';
      case Type.Transfer :
          if (this.transaction().destinationAccount?.id === this.transaction().account.id) {
            return '+';
          }
        return '-';
      case Type.Yield:
        return '+';
      default:
        return '';
    }
  });

}
