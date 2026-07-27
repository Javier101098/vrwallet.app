import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {TransactionStore} from '../../services/transaction-store.service';
import {TransactionItemComponent} from '../transaction-item/transaction-item.component';
import {TransactionResponse} from '../../interfaces/transaction.interface';
import {Message} from 'primeng/message';
import {Paginator, PaginatorState} from 'primeng/paginator';

@Component({
  selector: 'vrw-transactions-list',
  imports: [
    TransactionItemComponent,
    Message,
    Paginator
  ],
  templateUrl: './transaction-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionListComponent {
  readonly transactionStore = inject(TransactionStore);

  transactions = computed<TransactionResponse[]>(() => {
    return this.transactionStore.transactions();
  });

  onPageChange(event: PaginatorState){
    // this.transactionStore.setPage(event.page);
  }
}
