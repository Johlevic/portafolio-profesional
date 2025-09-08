import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  menuOpen = false;

  // para el hide/show on scroll
  lastScrollTop = 0;
  isHidden = false;
  private scrollThreshold = 12; // px mínimos para considerar un cambio

  constructor(private elRef: ElementRef) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
    if (this.menuOpen) {
      // si abres el menú, aseguramos que el header esté visible
      this.isHidden = false;
    }
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (this.menuOpen && !this.elRef.nativeElement.contains(target)) {
      this.closeMenu();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // si el menú está abierto, no ocultes el header
    if (this.menuOpen) {
      this.lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return;
    }

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const delta = currentScroll - this.lastScrollTop;

    // ignorar pequeños movimientos
    if (Math.abs(delta) <= this.scrollThreshold) {
      return;
    }

    if (currentScroll > this.lastScrollTop && currentScroll > 120) {
      // Scrolleando hacia abajo y ya pasamos 120px desde arriba -> ocultar
      this.isHidden = true;
    } else {
      // Scrolleando hacia arriba -> mostrar
      this.isHidden = false;
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  // Si sigues usando scrollTo / fragment en el header, mantenlo aquí
  scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerHeight = 64; // ajusta si tu header cambia de alto
      const y = el.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    this.closeMenu();
  }
}
