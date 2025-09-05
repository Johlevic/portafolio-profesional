import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appAnimateOnDisplay]',
  standalone: true
})
export class AnimateOnDisplayDirective implements OnChanges {
  @Input() appAnimateOnDisplay: boolean = false; // se pasa desde el template
  @Input() skillLevel: number = 0;

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    const progressBar = this.el.nativeElement as HTMLElement;
    const isMobile = window.innerWidth <= 767;

    if (isMobile && this.appAnimateOnDisplay) {
      progressBar.style.width = '0';
      setTimeout(() => {
        progressBar.style.transition = 'width 0.7s ease-in-out';
        progressBar.style.width = `${this.skillLevel}%`;
      }, 50);
    } else {
      // Pantallas grandes: barra llena + animación flotante CSS
      progressBar.style.width = `${this.skillLevel}%`;
      progressBar.style.transition = 'none';
    }
  }
}
