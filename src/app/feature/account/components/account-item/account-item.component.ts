import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {AccountDetail} from '../../interfaces/account-detail.interface';

@Component({
  selector: 'vrw-account-item',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './account-item.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountItemComponent {
  readonly account = input.required<AccountDetail>();
}
