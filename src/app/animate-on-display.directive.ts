import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appAnimateOnDisplay]',
  standalone: true,
})
export class AnimateOnDisplayDirective implements OnChanges {
  @Input() appAnimateOnDisplay: boolean = false; // se pasa desde el template
  @Input() skillLevel: number = 0;

  constructor(private el: ElementRef) {}

  private hasAnimated = false;

  ngOnChanges(): void {
    const progressBar = this.el.nativeElement as HTMLElement;

    if (this.appAnimateOnDisplay) {
      if (this.hasAnimated) return;

      progressBar.style.width = '0';
      setTimeout(() => {
        progressBar.style.transition = 'width 0.7s ease-in-out';
        progressBar.style.width = `${this.skillLevel}%`;
        this.hasAnimated = true;
      }, 50);
    } else {
      if (!this.hasAnimated) {
        progressBar.style.width = '0';
      }
    }
  }
}
