import { Component, OnInit, inject, HostListener, Inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SkeletonLoaderComponent } from './components/shared/skeleton-loader/skeleton-loader.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SkeletonLoaderComponent,
    ThemeToggleComponent,
    LanguageSelectorComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'my-portafolio';
  isLoading = true;
  showProfileInfo = false;
  isScrolled = false;
  isHome = true;

  // Inyectar servicios para inicializarlos
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private router = inject(Router);

  constructor(@Inject(DOCUMENT) private document: Document) {
    // Monitor route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHome = event.url === '/' || event.url === '/home';
        this.checkScroll(); // Re-evaluate on route change
      }
    });
  }

  ngOnInit() {
    // Simular carga de recursos (fuentes, imágenes, etc.)
    setTimeout(() => {
      this.isLoading = false;
    }, 1200); // 1.2 segundos para una carga profesional
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }

  private checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    // The background "curtain" activates with any scroll (> 20px)
    this.isScrolled = scrollPosition > 20;

    if (!this.isHome) {
      // Always show profile on internal pages
      this.showProfileInfo = true;
    } else {
      // On home page, wait until scrolling past hero section
      this.showProfileInfo = scrollPosition > 300;
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
