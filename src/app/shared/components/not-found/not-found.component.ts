import { ChangeDetectionStrategy, Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'vrw-not-found',
  imports: [
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './not-found.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {

}
