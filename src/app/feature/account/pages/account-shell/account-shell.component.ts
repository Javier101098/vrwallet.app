import { Component, inject } from '@angular/core';
import { AccountListComponent } from '../../components/account-list/account-list.component';
import { AccountStore } from '../../services/account-store.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-account-shell',
  imports: [AccountListComponent, CurrencyPipe],
  providers: [],
  templateUrl: './account-shell.component.html',
  styles: ``,
})
export default class AccountShellComponent {
  accountStore = inject(AccountStore);
}
