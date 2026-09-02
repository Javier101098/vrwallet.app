import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { AccountListComponent } from '../../components/account-list/account-list.component';
import { QuickActionsComponent } from '../../components/quick-actions/quick-actions.component';
import { FormsModule } from '@angular/forms';
import {AccountStore} from "../../services/account-store.service";
import {BalanceTotalCardComponent} from "@shared/components/balance-total-card/balance-total-card.component";
import {TotalAccountsCardComponent} from "../../components/total-accounts-card/total-accounts-card.component";
import {CreditBalanceCardComponent} from "../../components/credit-balance-card/credit-balance-card.component";

@Component({
  selector: 'vrw-account-shell',
  imports: [
    AccountListComponent,
    QuickActionsComponent,
    FormsModule,
    BalanceTotalCardComponent,
    TotalAccountsCardComponent,
    CreditBalanceCardComponent,
  ],
  providers: [],
  templateUrl: './account-shell.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountShellComponent {
  accountStore = inject(AccountStore);
}
