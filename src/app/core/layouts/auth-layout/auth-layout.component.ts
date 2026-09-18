import {ChangeDetectionStrategy, Component, HostBinding} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'vrw-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  standalone: true,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export default class AuthLayoutComponent {
  @HostBinding('class') hostClass = 'w-full grow';
}
