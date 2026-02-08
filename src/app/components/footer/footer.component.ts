import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '@/app/services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  languageService = inject(LanguageService);

  isOpen: { [key: string]: boolean } = {
    brand: false,
    links: false,
    contact: false,
  };

  quickLinks = [
    { href: '#inicio', label: 'nav.home' },
    { href: '#sobre-mi', label: 'nav.about' },
    { href: '#habilidades', label: 'nav.skills' },
    { href: '#proyectos', label: 'nav.projects' },
    { href: '#contacto', label: 'nav.contact' },
  ];

  socialLinks = [
    { icon: 'bi-github', href: 'https://github.com/Johlevic', label: 'GitHub' },
    {
      icon: 'bi-linkedin',
      href: 'https://www.linkedin.com/in/jhony-lezama/',
      label: 'LinkedIn',
    },
    {
      icon: 'bi-envelope-fill',
      href: 'mailto:jlezamavictorio@gmail.com',
      label: 'Email',
    },
  ];

  isMobile = false;
  currentYear = new Date().getFullYear();

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 992; // lg breakpoint

    // En desktop, mantener todas las secciones abiertas
    if (!this.isMobile) {
      this.isOpen = {
        brand: true,
        links: true,
        contact: true,
      };
    } else {
      // En móvil, cerrar todas las secciones inicialmente
      this.isOpen = {
        brand: false,
        links: false,
        contact: false,
      };
    }
  }

  toggleSection(section: string) {
    if (this.isMobile) {
      this.isOpen[section] = !this.isOpen[section];
    }
    // En desktop no hacemos nada ya que siempre deben estar abiertas
  }

  scrollToSection(href: string) {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
