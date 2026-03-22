import { Component, inject } from '@angular/core';
import { AccountListComponent } from '../../components/account-list/account-list.component';
import { AccountStore } from '../../services/account-store.service';
import {AccountBalanceCardComponent} from "../../components/account-balance-card/account-balance-card.component";
import {AccountQuickActionsComponent} from "../../components/account-quick-actions/account-quick-actions.component";

@Component({
  selector: 'vrw-account-shell',
  imports: [AccountListComponent, AccountBalanceCardComponent, AccountQuickActionsComponent],
  providers: [],
  templateUrl: './account-shell.component.html',
  styles: ``,
})
export default class AccountShellComponent {
  accountStore = inject(AccountStore);
}
