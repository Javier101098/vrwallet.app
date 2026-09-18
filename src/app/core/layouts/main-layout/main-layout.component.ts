import {ChangeDetectionStrategy, Component, HostBinding, inject} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {MetronicInitService} from "../../services/metronic-init.service";
import {HeaderComponent} from "@shared/components/header/header.component";
import {NavbarComponent} from "@shared/components/navbar/navbar.component";
import {ToolbarComponent} from "@shared/components/toolbar/toolbar.component";
import {FooterComponent} from "@shared/components/footer/footer.component";
import {MobileBottomNavComponent} from "@shared/components/mobile-bottom-nav/mobile-bottom-nav.component";
import {SwPush} from "@angular/service-worker";
import {PushNotificationService} from "@core/services/push-notification.service";
import {environment} from "@env/environment";

@Component({
  selector: 'vrw-main-layout',
  imports: [RouterOutlet, HeaderComponent, NavbarComponent, ToolbarComponent, FooterComponent, MobileBottomNavComponent, MobileBottomNavComponent],
  templateUrl: './main-layout.component.html',
  styles: ``,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  @HostBinding('class') bodyClass = 'flex grow flex-col in-data-kt-[sticky-header=on]:pt-(--header-height)';

  private metronicInitService = inject(MetronicInitService);
  private swPush = inject(SwPush);
  private pushService = inject(PushNotificationService);
  private readonly VAPID_PUBLIC_KEY = environment.push_public_key;

  constructor() {
    this.subscribe();
  }

  ngAfterViewInit(): void {
    this.metronicInitService.init();
  }

  subscribe() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => {
        this.pushService.subscribe(sub).subscribe({
          next: () => console.log("Suscripción enviada al servidor con éxito"),
        });
      })
      .catch(err => console.info("El usuario denegó el permiso o hubo un error:", err));
  }
}
