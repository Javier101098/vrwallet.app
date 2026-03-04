import { Component, input } from '@angular/core';
import { Account } from '../../interfaces/account.interface';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-account-item',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './account-item.component.html',
  styles: ``,
})
export class AccountItemComponent {
  readonly account = input.required<Account>();
  protected readonly RouterLink = RouterLink;
}
