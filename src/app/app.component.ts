import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MetronicInitService } from '@core/services/metronic-init.service';
import { filter } from 'rxjs';
import { Toast } from 'primeng/toast';
import { SwPush } from "@angular/service-worker";
import { environment } from "@env/environment";
import { PushNotificationService } from "@core/services/push-notification.service";

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
  private swPush = inject(SwPush);
  private pushService = inject(PushNotificationService);
  private readonly VAPID_PUBLIC_KEY = environment.push_public_key;

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.metronicInitService.init();
        }, 0);
      });
    
    this.subscribe();
  }
  
  subscribe(){
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => {
        this.pushService.subscribe(sub).subscribe({
          next: () => console.log("Suscripción enviada al servidor con éxito"),
          error: (err) => console.error("Error al enviar la suscripción al servidor", err)
        });
      })
      .catch(err => console.error("El usuario denegó el permiso o hubo un error:", err));
  }
}
