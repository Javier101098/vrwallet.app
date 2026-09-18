import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AccountStore} from "../../services/account-store.service";

@Component({
  selector: 'vrw-total-accounts-card',
  imports: [],
  templateUrl: './total-accounts-card.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalAccountsCardComponent {
  accountStore = inject(AccountStore);
}
