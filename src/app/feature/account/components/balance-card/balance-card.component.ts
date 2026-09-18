import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CountUpComponent} from '@shared/components/count-up/count-up.component';
import {AccountStore} from '../../services/account-store.service';

@Component({
  selector: 'vrw-balance-card',
  imports: [
    CountUpComponent
  ],
  templateUrl: './balance-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BalanceCardComponent {
  protected accountStore = inject(AccountStore);
}
