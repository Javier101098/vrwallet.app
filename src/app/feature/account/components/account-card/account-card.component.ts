import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CurrencyPipe, UpperCasePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {AccountSummaryResponse} from "../../interfaces/account-summary.interface";
import {CardComponent} from '@shared/components/card/card.component';

@Component({
  selector: 'vrw-account-card',
  imports: [
    CurrencyPipe,
    UpperCasePipe,
    RouterLink,
    CardComponent
  ],
  templateUrl: './account-card.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCardComponent {
  color = input.required<{primary:string,light:string}>();
  account = input.required<AccountSummaryResponse>();
}
