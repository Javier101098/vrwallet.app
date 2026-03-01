import {Component, input} from '@angular/core';
import {Account} from "../../interfaces/account.interface";
import {AccountItemComponent} from "../account-item/account-item.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    AccountItemComponent,
    RouterLink
  ],
  templateUrl: './account-list.component.html',
  styles: ``,
})
export class AccountListComponent {
  accounts = input.required<Account[]>();
}
