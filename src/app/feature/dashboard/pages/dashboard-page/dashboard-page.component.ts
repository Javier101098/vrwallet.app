import { Component } from '@angular/core';
import {
  AccountBalanceCardComponent
} from "../../../account/components/account-balance-card/account-balance-card.component";

@Component({
  selector: 'vrw-dashboard-page',
  imports: [
    AccountBalanceCardComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styles: ``,
})
export class DashboardPageComponent {}
