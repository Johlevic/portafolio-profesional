import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule], // <--- Importamos ngFor, ngIf, etc.
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'] // <--- debe ser plural
})
export class FooterComponent {
  quickLinks = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#sobre-mi', label: 'Sobre Mí' },
    { href: '#habilidades', label: 'Habilidades' },
    { href: '#proyectos', label: 'Proyectos' },
    { href: '#contacto', label: 'Contacto' },
  ];

  socialLinks = [
    { icon: 'bi-github', href: 'https://github.com/Johlevic', label: 'GitHub' },
    { icon: 'bi-linkedin', href: 'https://www.linkedin.com/in/jhony-lezama/', label: 'LinkedIn' },
    { icon: 'bi-envelope-fill', href: 'mailto:jlezamavictorio@gmail.com', label: 'Email' },
  ];


  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToSection(href: string) {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
