import { ChangeDetectionStrategy, Component } from '@angular/core';
import {TransactionFilterComponent} from '../../components/transaction-filter/transaction-filter.component';
import {TransactionListComponent} from '../../components/transaction-list/transaction-list.component';

@Component({
  selector: 'vrw-transaction-log',
  imports: [
    TransactionFilterComponent,
    TransactionListComponent
  ],
  templateUrl: './transaction-log.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TransactionLogComponent {}
