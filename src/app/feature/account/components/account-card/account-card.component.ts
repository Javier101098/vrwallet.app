import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CurrencyPipe, UpperCasePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {AccountSummary} from "../../interfaces/account-summary.interface";

@Component({
  selector: 'vrw-account-card',
  imports: [
    CurrencyPipe,
    UpperCasePipe,
    RouterLink
  ],
  templateUrl: './account-card.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush, 
})
export class AccountCardComponent {
  color = input.required<{primary:string,light:string}>();
  account = input.required<AccountSummary>();
}
