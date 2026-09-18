import {ChangeDetectionStrategy, Component, effect, input, signal} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'vrw-count-up',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './count-up.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountUpComponent {
  readonly value = input<number>(0);

  displayBalance = signal(0);

  private animationFrameId?: number;

  constructor() {
    effect(() => {
      const target = this.value();
      this.animateBalance(target);
    });
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private animateBalance(target: number) {
    const start = this.displayBalance();
    if (start === target) return;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const duration = 250;
    const startTime = performance.now();

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = start + (target - start) * easeProgress;

      this.displayBalance.set(current);

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(update);
      } else {
        this.displayBalance.set(target);
        this.animationFrameId = undefined;
      }
    };

    this.animationFrameId = requestAnimationFrame(update);
  }
}
