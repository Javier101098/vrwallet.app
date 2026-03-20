import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MetronicInitService } from '@core/services/metronic-init.service';
import { filter } from 'rxjs';
import { Toast } from 'primeng/toast';

@Component({
  selector: '[vrw-root]',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  private metronicInitService = inject(MetronicInitService);
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.metronicInitService.init();
        }, 0);
      });
  }
}
