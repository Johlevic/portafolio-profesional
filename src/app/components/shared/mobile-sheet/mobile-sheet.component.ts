import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-mobile-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-sheet.component.html',
  styleUrl: './mobile-sheet.component.scss',
})
export class MobileSheetComponent implements OnChanges, OnDestroy {
  @Input() isOpen = false;
  @Input() ariaLabel = 'Bottom sheet';
  @Input() panelClass = '';
  @Input() maxHeightVh = 85;
  @Input() minHeightVh?: number;
  @Input() transitionMs = 320;
  @Input() closeOnBackdrop = true;
  @Input() showHandle = true;
  @Input() showCloseButton = true;
  @Input() title?: string;
  @Input() headerIcon?: string;

  @Output() closeRequested = new EventEmitter<void>();
  private bodyClass = 'mobile-sheet-open';
  isRendered = false;
  isActive = false;
  private closeTimer?: ReturnType<typeof setTimeout>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.syncOpenState();
    }
  }

  ngOnDestroy(): void {
    this.clearCloseTimer();
    this.removeBodyClass();
  }

  get panelStyle(): Record<string, string> {
    const style: Record<string, string> = {
      maxHeight: `${this.maxHeightVh}vh`,
    };

    if (this.minHeightVh !== undefined && this.minHeightVh !== null) {
      style['minHeight'] = `${this.minHeightVh}vh`;
    }

    return style;
  }

  get transitionStyle(): Record<string, string> {
    return {
      '--sheet-transition-ms': `${this.transitionMs}ms`,
    };
  }

  close(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.closeRequested.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.closeOnBackdrop) {
      this.close();
    }
  }

  private syncOpenState(): void {
    if (this.isOpen) {
      this.openWithAnimation();
      return;
    }
    this.closeWithAnimation();
  }

  private openWithAnimation(): void {
    this.clearCloseTimer();
    this.isRendered = true;
    this.syncBodyClass();
    setTimeout(() => {
      this.isActive = true;
    }, 0);
  }

  private closeWithAnimation(): void {
    this.isActive = false;
    this.removeBodyClass();
    this.clearCloseTimer();
    this.closeTimer = setTimeout(() => {
      this.isRendered = false;
    }, this.transitionMs);
  }

  private clearCloseTimer(): void {
    if (!this.closeTimer) return;
    clearTimeout(this.closeTimer);
    this.closeTimer = undefined;
  }

  private syncBodyClass(): void {
    if (typeof document === 'undefined') return;
    if (this.isOpen) {
      document.body.classList.add(this.bodyClass);
    } else {
      this.removeBodyClass();
    }
  }

  private removeBodyClass(): void {
    if (typeof document === 'undefined') return;
    document.body.classList.remove(this.bodyClass);
  }
}
