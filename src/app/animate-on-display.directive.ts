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
    const isMobile = window.innerWidth <= 767;

    if (isMobile && this.appAnimateOnDisplay) {
      if (this.hasAnimated) return; // Ya se animó, no hacer nada

      progressBar.style.width = '0';
      setTimeout(() => {
        progressBar.style.transition = 'width 0.7s ease-in-out';
        progressBar.style.width = `${this.skillLevel}%`;
        this.hasAnimated = true;
      }, 50);
    } else {
      // Pantallas grandes o no móvil: barra llena
      progressBar.style.width = `${this.skillLevel}%`;
      progressBar.style.transition = 'none';
      if (isMobile && !this.appAnimateOnDisplay) {
        // Si es móvil pero aún no es visible, nos aseguramos de que esté en 0 si aún no ha animado
        if (!this.hasAnimated) progressBar.style.width = '0';
      }
    }
  }
}
