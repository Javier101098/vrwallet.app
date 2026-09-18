import {ChangeDetectionStrategy, Component} from '@angular/core';
import {format} from "date-fns";

@Component({
  selector: '[vrw-footer]',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  readonly year = format(new Date(),"yyyy");
}
