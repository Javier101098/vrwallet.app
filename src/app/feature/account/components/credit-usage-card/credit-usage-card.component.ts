import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {CardComponent} from '@shared/components/card/card.component';
import {CurrencyPipe, PercentPipe} from '@angular/common';
import {Credit} from '../../interfaces/credit.interface';

@Component({
  selector: 'vrw-credit-usage-card',
  imports: [
    CardComponent,
    CurrencyPipe,
    PercentPipe
  ],
  templateUrl: './credit-usage-card.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditUsageCardComponent {
  credit = input.required<Credit | null>();

  usedPercentage = computed<number>(() => {
    const credit = this.credit();
    if (!credit || credit.creditLimit === 0) return 0;
    return credit.creditUsed / credit.creditLimit;
  });

  available = computed<number>(() => this.credit()?.creditAvailable ?? 0);}
