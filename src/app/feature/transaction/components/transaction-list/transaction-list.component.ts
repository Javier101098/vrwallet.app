import { ChangeDetectionStrategy, Component } from '@angular/core';
import {CardComponent} from '@shared/components/card/card.component';

@Component({
  selector: 'vrw-transactions-list',
  imports: [
    CardComponent
  ],
  templateUrl: './transaction-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionListComponent {

}
