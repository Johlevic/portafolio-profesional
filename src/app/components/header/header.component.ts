import {
  Component,
  Renderer2,
  inject,
  Input,
  Inject,
  PLATFORM_ID,
  HostListener,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LanguageService } from '@/app/services/language.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ThemeToggleComponent,
    LanguageSelectorComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() showProfile = false;
  languageService = inject(LanguageService);
  mobileMenuOpen = false;

  /** Viewport menor que md: ocultar barra al bajar, mostrar al subir. */
  mobileHeaderHidden = false;
  private lastScrollY = 0;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (window.innerWidth >= 768) {
      this.mobileHeaderHidden = false;
      return;
    }
    if (this.mobileMenuOpen) {
      this.mobileHeaderHidden = false;
      return;
    }
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      this.mobileHeaderHidden = false;
      this.lastScrollY = window.scrollY || 0;
      return;
    }

    const y = window.scrollY || 0;
    const delta = y - this.lastScrollY;

    if (y < 32) {
      this.mobileHeaderHidden = false;
    } else if (delta > 10) {
      this.mobileHeaderHidden = true;
    } else if (delta < -10) {
      this.mobileHeaderHidden = false;
    }
    this.lastScrollY = y;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (window.innerWidth >= 768) {
      this.mobileHeaderHidden = false;
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.renderer.addClass(document.body, 'overflow-hidden');
    } else {
      this.renderer.removeClass(document.body, 'overflow-hidden');
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }

  navigateToMobile(section: string) {
    this.closeMobileMenu();
    // Navegar al home y luego hacer scroll
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        const el = document.getElementById(section);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  }
}
