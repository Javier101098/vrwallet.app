import {Component, computed, input} from '@angular/core';
import {Transaction, Type,} from '../../../transaction/interfaces/transaction.interface';
import {CurrencyPipe, DatePipe} from '@angular/common';

enum Operation {
  Incoming,
  Outgoing
}

@Component({
  selector: 'vrw-account-transaction-item',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './account-transaction-item.component.html',
  styles: ``,
})
export class AccountTransactionItemComponent {
  accountId = input.required<string>();
  transaction = input.required<Transaction>();
  
  typeOperation = computed(() => {
    return this.transaction().type === Type.Income ||
      (this.transaction().type === Type.Transfer && this.transaction().destinationAccountId == this.accountId() ) 
      ? Operation.Incoming 
      : Operation.Outgoing
  });
  
  icon = computed(() => {
    if (this.typeOperation() === Operation.Incoming){
      return 'ki-arrow-up-right';
    }else{
      return 'ki-arrow-down-left';
    }
  });

  typeName = computed(() => {
    const type = this.transaction().type;

    switch (type) {
      case Type.Income:
        return 'Ingreso';

      case Type.Expense:
        return 'Gasto';

      case Type.Transfer:
        return 'Transferencia';

      default:
        return 'Transacción';
    }
  });

  colorClasses = computed(() => {
    const type = this.transaction().type;

    switch (type) {
      case Type.Income:
        return 'bg-green-100 text -green-600 group-hover:bg-green-200';

      case Type.Expense:
        return 'bg-slate-100 text-slate-600 group-hover:bg-slate-200';

      case Type.Transfer:
        return 'bg-blue-100 text-blue-600 group-hover:bg-blue-200';

      default:
        return 'bg-slate-50 text-slate-600 group-hover:bg-slate-100';
    }
  });

  amountColorClass = computed(() => {
    const type = this.transaction().type;

    switch (type) {
      case Type.Income:
        return 'text-green-600';

      case Type.Expense:
        return 'text-slate-600';

      case Type.Transfer:
        return 'text-blue-600';

      default:
        return 'text-slate-600';
    }
  });
}
