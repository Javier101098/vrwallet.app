import {Component, inject} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {AccountStore} from "../../services/account-store.service";

@Component({
  selector: 'vrw-account-balance-card',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './account-balance-card.component.html',
  styles: ``,
})
export class AccountBalanceCardComponent {
  accountStore = inject(AccountStore);
}
