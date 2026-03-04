import { Component, inject } from '@angular/core';
import { AccountItemComponent } from '../account-item/account-item.component';
import { RouterLink } from '@angular/router';
import { AccountStore } from '../../services/account-store.service';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'vrw-account-list',
  standalone: true,
  imports: [AccountItemComponent, RouterLink, ProgressSpinner],
  templateUrl: './account-list.component.html',
  styles: ``,
})
export class AccountListComponent {
  accountStore = inject(AccountStore);
}
