import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { AccountListComponent } from '../../components/account-list/account-list.component';
import { QuickActionsComponent } from '../../components/quick-actions/quick-actions.component';
import { FormsModule } from '@angular/forms';
import {AccountStore} from "../../services/account-store.service";
import {BalanceCardComponent} from '../../components/balance-card/balance-card.component';

@Component({
  selector: 'vrw-account-shell',
  imports: [
    AccountListComponent,
    QuickActionsComponent,
    FormsModule,
    BalanceCardComponent,
  ],
  providers: [],
  templateUrl: './account-shell.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountShellComponent {
  accountStore = inject(AccountStore);
}
