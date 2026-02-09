import {
  Component,
  OnInit,
  inject,
  HostListener,
  Inject,
  ViewChildren,
  QueryList,
  ElementRef,
  PLATFORM_ID,
} from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { DOCUMENT, CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SkeletonLoaderComponent } from './components/shared/skeleton-loader/skeleton-loader.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { ThemeService } from './services/theme.service';
import { LanguageService } from './services/language.service';
import { BottomSheetService } from './services/bottom-sheet.service';
import { AnimateOnDisplayDirective } from './animate-on-display.directive';
import { LoadingModalService } from './services/loading-modal.service';

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
    AnimateOnDisplayDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @ViewChildren('historyItem') historyItems!: QueryList<ElementRef>;

  title = 'my-portafolio';
  isLoading = true;
  showProfileInfo = false;
  isScrolled = false;
  isHome = true;
  isCvViewer = false;

  // Inyectar servicios para inicializarlos
  private themeService = inject(ThemeService);
  public languageService = inject(LanguageService);
  public bottomSheetService = inject(BottomSheetService);
  public loadingModalService = inject(LoadingModalService);
  private router = inject(Router);

  constructor(@Inject(DOCUMENT) private document: Document) {
    // Monitor route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHome = event.url === '/' || event.url === '/home';
        this.isCvViewer = event.url === '/cv';
        this.checkScroll(); // Re-evaluate on route change
      }
    });
  }

  private platformId = inject(PLATFORM_ID);
  private readonly LOADER_KEY = 'hasSeenLoader_v1';

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Mostrar siempre el skeleton en cada refresh
      setTimeout(() => {
        this.isLoading = false;
      }, 1500);
    } else {
      this.isLoading = false; // Fallback para SSR
    }

    // Auto-scroll logic for bottom sheet history
    this.bottomSheetService.isOpen$.subscribe((isOpen) => {
      if (isOpen) {
        const content = this.bottomSheetService.getContent();
        if (
          content?.type === 'article' &&
          content.highlightIndex !== undefined
        ) {
          const index = content.highlightIndex;
          // Esperamos a que la animación de apertura termine y el contenido se renderice
          setTimeout(() => {
            const target = this.historyItems.toArray()[index];
            if (target) {
              target.nativeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }
          }, 600); // 500ms de transición + 100ms de margen
        }
      }
    });
  }

  @HostListener('window:scroll', [])
  @HostListener('window:resize', [])
  onWindowAction() {
    this.checkScroll();
    this.checkResponsiveState();
  }

  private checkResponsiveState() {
    if (window.innerWidth >= 768) {
      // md breakpoint
      this.bottomSheetService.close();
    }
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
