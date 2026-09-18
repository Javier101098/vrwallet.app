import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'vrw-sign-up',
  imports: [RouterLink],
  templateUrl: './sign-up.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignUpComponent {}
