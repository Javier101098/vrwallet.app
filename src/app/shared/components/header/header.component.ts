import { Component } from '@angular/core';
import { UserDropdownComponent } from '../partials/user-dropdown/user-dropdown.component';
import { NotificationComponent } from '../partials/notification/notification.component';
import {RouterLink} from "@angular/router";

@Component({
  selector: '[app-header]',
  imports: [NotificationComponent, UserDropdownComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
