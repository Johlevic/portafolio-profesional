import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '@/app/services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  languageService = inject(LanguageService);

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

  currentYear = new Date().getFullYear();
}
