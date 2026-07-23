import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {TransactionStore} from '../../services/transaction-store.service';
import {TransactionItemComponent} from '../transaction-item/transaction-item.component';
import {Transaction, TransactionResponse} from '../../interfaces/transaction.interface';

@Component({
  selector: 'vrw-transactions-list',
  imports: [
    TransactionItemComponent
  ],
  templateUrl: './transaction-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionListComponent {
  readonly transactionStore = inject(TransactionStore);

  transactions = computed<TransactionResponse[]>(() => {
    return this.transactionStore.transactions();
  });
}
