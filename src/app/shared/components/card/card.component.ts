import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'vrw-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @HostBinding('class') class = 'w-full';
}
