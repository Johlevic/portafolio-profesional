import { ElementRef } from '@angular/core';
import { AnimateOnDisplayDirective } from './animate-on-display.directive';

describe('AnimateOnDisplayDirective', () => {
  let directive: AnimateOnDisplayDirective;

  beforeEach(() => {
    const el = { nativeElement: document.createElement('div') } as ElementRef;
    directive = new AnimateOnDisplayDirective(el); // ✅ ahora sí recibe el argumento
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
