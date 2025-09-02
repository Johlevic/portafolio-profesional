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
    { icon: '🐙', href: 'https://github.com/tuusuario', label: 'GitHub' },
    { icon: '💼', href: 'https://linkedin.com/in/tuusuario', label: 'LinkedIn' },
    { icon: '🐦', href: 'https://twitter.com/tuusuario', label: 'Twitter' },
    { icon: '✉️', href: 'mailto:hola@desarrollador.com', label: 'Email' },
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
