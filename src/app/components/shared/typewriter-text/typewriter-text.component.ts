import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-typewriter-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [attr.aria-label]="fullText">{{ visible }}</span
    ><span
      *ngIf="!done && useCursor"
      class="inline-block w-0.5 h-[0.85em] ml-0.5 align-[-0.12em] rounded-sm bg-current opacity-70 animate-pulse"
      aria-hidden="true"
    ></span>
  `,
})
export class TypewriterTextComponent implements OnChanges, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) text!: string;
  @Input() msPerChar = 38;
  @Input() useCursor = true;

  visible = '';
  done = true;
  fullText = '';

  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text']) {
      this.run();
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private run(): void {
    this.clearTimer();
    const full = (this.text ?? '').trim();
    this.fullText = full;

    if (!full) {
      this.visible = '';
      this.done = true;
      return;
    }

    if (
      !isPlatformBrowser(this.platformId) ||
      typeof window.matchMedia === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      this.visible = full;
      this.done = true;
      return;
    }

    this.done = false;
    this.visible = '';
    let i = 0;
    this.timer = setInterval(() => {
      i += 1;
      this.visible = full.slice(0, i);
      this.cdr.markForCheck();
      if (i >= full.length) {
        this.clearTimer();
        this.done = true;
        this.cdr.markForCheck();
      }
    }, this.msPerChar);
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
