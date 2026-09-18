import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MetronicInitService } from '@core/services/metronic-init.service';
import { filter } from 'rxjs';
import { Toast } from 'primeng/toast';
import { SwUpdate } from '@angular/service-worker';

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
  private updates = inject(SwUpdate);

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.metronicInitService.init();
        }, 0);
      });

    this.updates.versionUpdates.subscribe((evt) => {
      if (evt.type === 'VERSION_READY') {
        if (confirm('Nueva versión disponible. ¿Actualizar?')) {
          location.reload();
        }
      }
    });
  }
}
