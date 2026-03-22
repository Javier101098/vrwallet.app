import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'vrw-account-quick-actions',
  imports: [
    RouterLink
  ],
  templateUrl: './account-quick-actions.component.html',
  styles: ``,
})
export class AccountQuickActionsComponent {
  router = inject(Router);
}
