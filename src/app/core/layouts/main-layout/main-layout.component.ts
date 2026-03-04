import {Component, HostBinding, inject} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {MetronicInitService} from "../../services/metronic-init.service";
import {HeaderComponent} from "@shared/components/header/header.component";
import {NavbarComponent} from "@shared/components/navbar/navbar.component";
import {ToolbarComponent} from "@shared/components/toolbar/toolbar.component";
import {FooterComponent} from "@shared/components/footer/footer.component";

@Component({
  selector: 'vrw-main-layout',
  imports: [RouterOutlet,HeaderComponent, NavbarComponent, ToolbarComponent, FooterComponent, HeaderComponent],
  templateUrl: './main-layout.component.html',
  styles: ``
})
export class MainLayoutComponent {
  @HostBinding('class') bodyClass = 'flex grow flex-col in-data-kt-[sticky-header=on]:pt-(--header-height)';
  private metronicInitService = inject(MetronicInitService);
  ngAfterViewInit(): void {
    this.metronicInitService.init();
  }
}
