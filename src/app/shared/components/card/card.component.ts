import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'vrw-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host:{
    class: 'w-full'
  }
})
export class CardComponent {}
