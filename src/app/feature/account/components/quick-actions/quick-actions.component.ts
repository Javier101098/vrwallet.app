import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'vrw-quick-actions',
  imports: [RouterLink],
  templateUrl: './quick-actions.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickActionsComponent {
  router = inject(Router);
}
