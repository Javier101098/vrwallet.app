import {ChangeDetectionStrategy, Component, computed, effect, input} from '@angular/core';
import {CurrencyPipe, PercentPipe} from '@angular/common';
import { RouterLink } from '@angular/router';
import {AccountDetail} from '../../interfaces/account-detail.interface';
import {Credit} from '../../interfaces/credit.interface';

@Component({
  selector: 'vrw-account-item',
  imports: [CurrencyPipe, RouterLink, PercentPipe],
  templateUrl: './account-item.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountItemComponent {
  readonly account = input.required<AccountDetail>();

  credit = computed<Credit|null>(() => this.account().credit ?? null);

  isCredit = computed(() => this.credit() != null);

  percentageOfCreditUsed = computed(() => {
    if (this.credit() == null) return 0;
    const { creditLimit,creditUsed } = this.credit()!;
    return creditUsed / creditLimit;
  });

  constructor() {
    effect(() => {
      this.percentageOfCreditUsed();
    });
  }
}
