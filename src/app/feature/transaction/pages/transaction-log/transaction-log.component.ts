import {ChangeDetectionStrategy, Component, effect, inject, signal} from '@angular/core';
import {TransactionFilterComponent} from '../../components/transaction-filter/transaction-filter.component';
import {TransactionListComponent} from '../../components/transaction-list/transaction-list.component';
import {TransactionStore} from '../../services/transaction-store.service';
import {TransactionFilterRequest} from '../../interfaces/transaction-filter.interface';
import {PaginatorState} from 'primeng/paginator';

@Component({
  selector: 'vrw-transaction-log',
  imports: [
    TransactionFilterComponent,
    TransactionListComponent,
  ],
  templateUrl: './transaction-log.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TransactionLogComponent {
  readonly transactionStore = inject(TransactionStore);

  filters  = signal<TransactionFilterRequest | null>(null);

  setFilter(filters: TransactionFilterRequest){
    this.filters.set(filters);
  }

  setPaginate(paginatorState: PaginatorState) {
    const { page = 0, rows: limit  } = paginatorState;

    this.filters.update((filters) => ({
      ...filters!,
      page: page + 1,
      limit
    }));
  }

  constructor() {
    effect(() => {
      if (this.filters() != null){
        this.transactionStore.loadTransactions(this.filters()!);
      }
    })
  }
}
