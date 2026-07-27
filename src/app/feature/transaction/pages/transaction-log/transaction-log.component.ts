import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TransactionFilterComponent} from '../../components/transaction-filter/transaction-filter.component';
import {TransactionListComponent} from '../../components/transaction-list/transaction-list.component';
import {ProgressSpinner} from 'primeng/progressspinner';
import {TransactionStore} from '../../services/transaction-store.service';

@Component({
  selector: 'vrw-transaction-log',
  imports: [
    TransactionFilterComponent,
    TransactionListComponent,
    ProgressSpinner
  ],
  templateUrl: './transaction-log.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TransactionLogComponent {
  readonly transactionStore = inject(TransactionStore);
}
