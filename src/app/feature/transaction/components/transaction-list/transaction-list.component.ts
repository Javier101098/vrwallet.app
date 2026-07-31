import {ChangeDetectionStrategy, Component, computed, inject, output} from '@angular/core';
import {TransactionStore} from '../../services/transaction-store.service';
import {TransactionItemComponent} from '../transaction-item/transaction-item.component';
import {TransactionResponse} from '../../interfaces/transaction.interface';
import {Paginator, PaginatorState} from 'primeng/paginator';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'vrw-transactions-list',
  imports: [
    TransactionItemComponent,
    Paginator,
    ProgressSpinner
  ],
  templateUrl: './transaction-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionListComponent {
  onChangePage = output<PaginatorState>();

  readonly transactionStore = inject(TransactionStore);

  data = computed(() => this.transactionStore.data());
  first = computed(() => {
    return ((this.data()?.pageNumber ?? 1) - 1) * (this.data()?.pageSize ?? 0);
  });
  transactions = computed<TransactionResponse[]>(() => {
    return this.transactionStore.data()?.items ?? [];
  });

  onPageChange(event: PaginatorState){
    this.onChangePage.emit(event);
  }
}
