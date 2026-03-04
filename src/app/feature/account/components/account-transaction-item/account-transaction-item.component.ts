import { Component, computed, input } from '@angular/core';
import {
  Transaction,
  Type,
} from '../../../transaction/interfaces/transaction.interface';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'vrw-account-transaction-item',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './account-transaction-item.component.html',
  styles: ``,
})
export class AccountTransactionItemComponent {
  transaction = input.required<Transaction>();

  icon = computed(() => {
    const type = this.transaction().type;

    switch (type) {
      case Type.Income:
        return 'ki-arrow-up-right';

      case Type.Expense:
        return 'ki-arrow-down-left';

      case Type.Transfer:
        return 'ki-arrow-up-right';

      default:
        return 'ki-arrow-up-right';
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

      case Type.Yield:
        return 'Rendimiento';

      default:
        return 'Transacción';
    }
  });

  colorClasses = computed(() => {
    const type = this.transaction().type;

    switch (type) {
      case Type.Income:
      case Type.Yield:
        return 'bg-green-100 text-green-600 group-hover:bg-green-200';

      case Type.Expense:
        return 'bg-slate-100 text-slate-600 group-hover:bg-slate-200';

      case Type.Transfer:
        return 'bg-blue-100 text-blue-600 group-hover:bg-blue-200';

      default:
        return 'bg-slate-50 text-slate-600 group-hover:bg-slate-100';
    }
  });
}
