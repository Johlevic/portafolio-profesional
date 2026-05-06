import {
  Component,
  HostListener,
  OnInit,
  Inject,
  PLATFORM_ID,
  inject,
  ViewChild,
  ElementRef,
  TemplateRef,
  OnDestroy,
  ChangeDetectorRef,
  afterNextRender,
  EnvironmentInjector,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SliderComponent } from '../../reusable/slider/slider.component';
import {
  ProjectCardComponent,
  Project,
} from '../../shared/project-card/project-card.component';
import { LanguageService } from '@/app/services/language.service';
import { HeaderPortalService } from '@/app/services/header-portal.service';

export type ProjectSortOrder =
  | 'default'
  | 'az'
  | 'za'
  | 'recent'
  | 'oldest';
export type ProjectLinkFilter = 'all' | 'withExtra' | 'repoOnly';
export type ProjectStackFilter =
  | 'all'
  | 'java'
  | 'laravel'
  | 'react'
  | 'other';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderComponent, ProjectCardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit, OnDestroy {
  languageService = inject(LanguageService);
  private headerPortalService = inject(HeaderPortalService);
  private cdr = inject(ChangeDetectorRef);
  private el = inject(ElementRef);
  private readonly envInjector = inject(EnvironmentInjector);

  isTablet = false;
  isDesktop = false;
  showAll = false;
  private isStickyVisible = false;

  /** Orden original (índice) por clave de título i18n */
  private readonly projectOrder = new Map<string, number>();

  searchQuery = '';
  sortOrder: ProjectSortOrder = 'default';
  linkFilter: ProjectLinkFilter = 'all';
  stackFilter: ProjectStackFilter = 'all';

  /** Bottom sheet de filtros en viewport móvil (por debajo de `md`). */
  filtersSheetOpen = false;
  filtersSheetVisible = false;
  private readonly filtersSheetTransitionMs = 320;
  private closeFiltersTimer?: ReturnType<typeof setTimeout>;

  /** Panel lateral derecho de filtros en escritorio (`lg+`, al pulsar el icono del header). */
  desktopFiltersPanelOpen = false;
  desktopFiltersPanelVisible = false;
  private readonly desktopFiltersTransitionMs = 320;
  private closeDesktopFiltersTimer?: ReturnType<typeof setTimeout>;

  readonly linkFilterOptions: { value: ProjectLinkFilter; labelKey: string }[] =
    [
      { value: 'all', labelKey: 'projects.filterLinkAll' },
      { value: 'withExtra', labelKey: 'projects.filterLinkWithExtra' },
      { value: 'repoOnly', labelKey: 'projects.filterLinkRepoOnly' },
    ];

  @ViewChild('headerRef') headerRef!: ElementRef;
  @ViewChild('stickyTitleTemplate') stickyTitleTemplate!: TemplateRef<any>;

  /** `addedAt` (ISO) alimenta “Más recientes / Más antiguos”; ajusta fechas al dar de alta un proyecto. */
  projects: Project[] = [
    {
      title: 'projects.ledWeb',
      addedAt: '2024-03-01',
      image: 'assets/img/projects/led-web/led-web.jpeg',
      technologies: [
        { name: 'Laravel', icon: 'fab fa-laravel' },
        { name: 'React', icon: 'fab fa-react' },
        { name: 'Inertia' },
        { name: 'Tailwind', icon: 'fab fa-css3-alt' },
        { name: 'MySQL', icon: 'fas fa-database' },
        { name: 'Jetstream', icon: 'fas fa-shield-alt' },
      ],
      repoLink: 'https://github.com/Johlevic/led-web',
      repoOnly: true,
    },
    {
      title: 'projects.foroHub',
      addedAt: '2024-05-15',
      image: 'assets/img/projects/foro-hub/apirest-message.png',
      technologies: [
        { name: 'Java 21', icon: 'fab fa-java' },
        { name: 'Spring Boot' },
        { name: 'Spring Security', icon: 'fas fa-shield-alt' },
        { name: 'Spring Data JPA' },
        { name: 'JWT', icon: 'fas fa-key' },
        { name: 'MySQL', icon: 'fas fa-database' },
        { name: 'Flyway', icon: 'fas fa-exchange-alt' },
        { name: 'Maven', icon: 'fas fa-cube' },
        { name: 'OpenAPI', icon: 'fas fa-book' },
      ],
      repoLink: 'https://github.com/Johlevic/foro-hub',
      repoOnly: true,
    },
    {
      title: 'projects.literalura',
      addedAt: '2024-07-20',
      image: 'assets/img/projects/api-books/api-books.png',
      technologies: [
        { name: 'Java 21', icon: 'fab fa-java' },
        { name: 'Spring Boot' },
        { name: 'PostgreSQL', icon: 'fas fa-database' },
        { name: 'Spring Data JPA' },
        { name: 'Gutendex' },
        { name: 'Jackson', icon: 'fas fa-code' },
        { name: 'Maven', icon: 'fas fa-cube' },
        { name: 'CLI', icon: 'fas fa-terminal' },
      ],
      repoLink: 'https://github.com/Johlevic/literalura',
      repoOnly: true,
    },
    {
      title: 'projects.capturaApp',
      addedAt: '2024-10-01',
      image: 'assets/img/projects/captura-app/captura-app-ba.png',
      technologies: [
        { name: 'Tauri 2', icon: 'fas fa-desktop' },
        { name: 'Rust', icon: 'fab fa-rust' },
        { name: 'Vite', icon: 'fas fa-bolt' },
        { name: 'HTML', icon: 'fab fa-html5' },
        { name: 'JavaScript', icon: 'fab fa-js' },
        { name: 'Tailwind', icon: 'fab fa-css3-alt' },
        { name: 'pnpm' },
      ],
      repoLink: 'https://github.com/Johlevic/captura-app',
      projectLink:
        'https://github.com/Johlevic/captura-app/raw/main/CapturaApp_0.1.0_x64-setup.exe',
      projectLinkLabelKey: 'projects.downloadDirect',
    },
    {
      title: 'projects.verses',
      addedAt: '2025-01-10',
      image: 'assets/img/projects/verses-bibl/logo-refugio-celestial-best.png',
      technologies: [
        { name: 'React', icon: 'fab fa-react' },
        { name: 'TypeScript', icon: 'fab fa-js' },
        { name: 'CSS', icon: 'fab fa-css3-alt' },
        { name: 'Astro' },
        { name: 'PWA' },
      ],
      repoLink: 'https://github.com/Johlevic/versiculos-biblicos',
      projectLink: 'https://versiculos-biblicos.onrender.com/',
    },
    {
      title: 'projects.ditechPeru',
      addedAt: '2025-02-15',
      image: 'assets/img/projects/pantallas-led.png',
      technologies: [
        { name: 'Laravel', icon: 'fab fa-laravel' },
        { name: 'React', icon: 'fab fa-react' },
        { name: 'Inertia' },
        { name: 'Tailwind', icon: 'fab fa-css3-alt' },
        { name: 'MySQL', icon: 'fas fa-database' },
      ],
      repoLink: 'https://github.com/Johlevic/ledpantallas',
      projectLink: 'https://ditechperu.com/',
    },
    {
      title: 'projects.conversorMonedas',
      addedAt: '2025-04-15',
      image: 'assets/img/projects/change-currency/apirest-change.png',
      technologies: [
        { name: 'Java 17+', icon: 'fab fa-java' },
        { name: 'CLI', icon: 'fas fa-terminal' },
        { name: 'MVC' },
        { name: 'HttpClient', icon: 'fas fa-network-wired' },
        { name: 'JSON' },
        { name: 'ExchangeRate-API' },
      ],
      repoLink: 'https://github.com/Johlevic/ChallengeConversorMonedas',
      repoOnly: true,
    },
    {
      title: 'projects.amigoSecreto',
      addedAt: '2025-08-01',
      image: 'assets/img/projects/amigo-secreto/sortear-amigo.png',
      technologies: [
        { name: 'HTML5', icon: 'fab fa-html5' },
        { name: 'CSS3', icon: 'fab fa-css3-alt' },
        { name: 'JavaScript', icon: 'fab fa-js' },
        { name: 'SweetAlert2' },
        { name: 'Confetti.js', icon: 'fas fa-gift' },
        { name: 'Vercel' },
      ],
      repoLink: 'https://github.com/Johlevic/AmigoSecreto',
      projectLink: 'https://amigo-secreto-neon-eta.vercel.app/',
    },
    {
      title: 'projects.juegoSecreto',
      addedAt: '2025-10-20',
      image: 'assets/img/projects/numero-secreto/numero-secreto.png',
      technologies: [
        { name: 'HTML5', icon: 'fab fa-html5' },
        { name: 'CSS3', icon: 'fab fa-css3-alt' },
        { name: 'JavaScript', icon: 'fab fa-js' },
        { name: 'Vercel' },
      ],
      repoLink: 'https://github.com/Johlevic/juegoSecreto',
      projectLink: 'https://juego-secreto-phi.vercel.app/',
    },
    {
      title: 'projects.nutriCalc',
      addedAt: '2026-05-03',
      image: 'assets/img/projects/nutri-calc/nutri-app.png',
      technologies: [
        { name: 'HTML5', icon: 'fab fa-html5' },
        { name: 'CSS3', icon: 'fab fa-css3-alt' },
        { name: 'JavaScript', icon: 'fab fa-js' },
        { name: 'Font Awesome', icon: 'fab fa-font-awesome' },
        { name: 'PWA' },
        { name: 'Vercel' },
      ],
      repoLink: 'https://github.com/Johlevic/nutri-calc',
      projectLink: 'https://nutri-calc-sysjol.vercel.app/',
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.projects.forEach((p, i) => this.projectOrder.set(p.title, i));
    this.checkIfTablet();
  }

  ngOnDestroy() {
    this.clearFiltersCloseTimer();
    this.clearDesktopFiltersCloseTimer();
    this.closeFiltersSheet();
    this.closeDesktopFiltersPanel(false);
    this.headerPortalService.clearPortalContent();
  }

  openFiltersSheet(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.clearFiltersCloseTimer();
    this.filtersSheetVisible = true;
    this.filtersSheetOpen = false;
    document.body.style.overflow = 'hidden';
    /** Mover el sheet a `body` para evitar ancestros con `transform` que rompen `fixed` (p. ej. scroll-reveal). */
    afterNextRender(
      () => {
        const root = document.getElementById('projects-filters-sheet-root');
        if (root && root.parentElement !== document.body) {
          document.body.appendChild(root);
        }
        requestAnimationFrame(() => {
          this.filtersSheetOpen = true;
        });
      },
      { injector: this.envInjector },
    );
  }

  closeFiltersSheet(): void {
    this.filtersSheetOpen = false;
    this.clearFiltersCloseTimer();
    this.closeFiltersTimer = setTimeout(() => {
      this.filtersSheetVisible = false;
      if (isPlatformBrowser(this.platformId)) {
        document.body.style.overflow = '';
      }
    }, this.filtersSheetTransitionMs);
  }

  stickyHeaderFiltersClick(ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.openDesktopFiltersPanel();
  }

  openDesktopFiltersPanel(): void {
    if (!isPlatformBrowser(this.platformId) || !this.isDesktop) {
      return;
    }
    if (this.filtersSheetVisible || this.filtersSheetOpen) {
      this.clearFiltersCloseTimer();
      this.filtersSheetOpen = false;
      this.filtersSheetVisible = false;
    }
    this.clearDesktopFiltersCloseTimer();
    this.desktopFiltersPanelVisible = true;
    this.desktopFiltersPanelOpen = false;
    document.body.style.overflow = 'hidden';
    this.cdr.detectChanges();
    /** Fuera de `main`/`app-root`: la barra fija superior es hermana de `main` y quedaba por encima del overlay. */
    afterNextRender(
      () => {
        const root = document.getElementById('projects-filters-desktop-root');
        if (root && root.parentElement !== document.body) {
          document.body.appendChild(root);
        }
        requestAnimationFrame(() => {
          this.desktopFiltersPanelOpen = true;
          this.cdr.detectChanges();
        });
      },
      { injector: this.envInjector },
    );
  }

  closeDesktopFiltersPanel(animate = true): void {
    this.desktopFiltersPanelOpen = false;
    this.clearDesktopFiltersCloseTimer();
    const done = () => {
      this.desktopFiltersPanelVisible = false;
      if (isPlatformBrowser(this.platformId)) {
        document.body.style.overflow = '';
      }
    };
    if (!animate || !isPlatformBrowser(this.platformId)) {
      done();
      return;
    }
    this.closeDesktopFiltersTimer = setTimeout(
      done,
      this.desktopFiltersTransitionMs,
    );
  }

  @HostListener('document:keydown.escape')
  onDocumentEscape(): void {
    if (this.filtersSheetOpen) {
      this.closeFiltersSheet();
    }
    if (this.desktopFiltersPanelOpen) {
      this.closeDesktopFiltersPanel();
    }
  }

  onFiltersChange(): void {
    this.showAll = false;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.sortOrder = 'default';
    this.linkFilter = 'all';
    this.stackFilter = 'all';
    this.showAll = false;
    this.closeFiltersSheet();
    this.closeDesktopFiltersPanel();
  }

  get hasActiveFilters(): boolean {
    return (
      this.searchQuery.trim().length > 0 ||
      this.sortOrder !== 'default' ||
      this.linkFilter !== 'all' ||
      this.stackFilter !== 'all'
    );
  }

  get filteredProjects(): Project[] {
    let list = this.projects.filter(
      (p) => this.matchesLinkFilter(p) && this.matchesStackFilter(p),
    );

    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const title = this.languageService.t(p.title).toLowerCase();
        const techBlob = (p.technologies ?? [])
          .map((t) => t.name.toLowerCase())
          .join(' ');
        return title.includes(q) || techBlob.includes(q);
      });
    }

    const sorted = [...list];
    const collator = (a: Project, b: Project) =>
      this.languageService
        .t(a.title)
        .localeCompare(this.languageService.t(b.title), undefined, {
          sensitivity: 'base',
        });

    if (this.sortOrder === 'az') {
      sorted.sort(collator);
    } else if (this.sortOrder === 'za') {
      sorted.sort((a, b) => collator(b, a));
    } else if (this.sortOrder === 'recent') {
      sorted.sort((a, b) => {
        const d =
          this.getAddedAtEpochMs(b) - this.getAddedAtEpochMs(a);
        if (d !== 0) {
          return d;
        }
        return (
          (this.projectOrder.get(b.title) ?? 0) -
          (this.projectOrder.get(a.title) ?? 0)
        );
      });
    } else if (this.sortOrder === 'oldest') {
      sorted.sort((a, b) => {
        const d =
          this.getAddedAtEpochMs(a) - this.getAddedAtEpochMs(b);
        if (d !== 0) {
          return d;
        }
        return (
          (this.projectOrder.get(a.title) ?? 0) -
          (this.projectOrder.get(b.title) ?? 0)
        );
      });
    } else {
      sorted.sort(
        (a, b) =>
          (this.projectOrder.get(a.title) ?? 0) -
          (this.projectOrder.get(b.title) ?? 0),
      );
    }

    return sorted;
  }

  private getAddedAtEpochMs(p: Project): number {
    if (p.addedAt) {
      const t = Date.parse(p.addedAt);
      if (!Number.isNaN(t)) {
        return t;
      }
    }
    return (this.projectOrder.get(p.title) ?? 0) * 86400000;
  }

  private matchesLinkFilter(p: Project): boolean {
    switch (this.linkFilter) {
      case 'repoOnly':
        return !!p.repoOnly;
      case 'withExtra':
        return !!p.projectLink;
      default:
        return true;
    }
  }

  private matchesStackFilter(p: Project): boolean {
    if (this.stackFilter === 'all') {
      return true;
    }
    const blob = (p.technologies ?? [])
      .map((t) => t.name.toLowerCase())
      .join(' ');
    const hasJava = /\bjava\b|spring/.test(blob);
    const hasLaravel = blob.includes('laravel');
    const hasReact = /\breact\b/.test(blob);

    switch (this.stackFilter) {
      case 'java':
        return hasJava;
      case 'laravel':
        return hasLaravel;
      case 'react':
        return hasReact;
      case 'other':
        return !hasJava && !hasLaravel && !hasReact;
      default:
        return true;
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    if (
      !this.isDesktop ||
      !isPlatformBrowser(this.platformId) ||
      !this.headerRef
    )
      return;

    const headerRect = this.headerRef.nativeElement.getBoundingClientRect();
    const componentRect = this.el.nativeElement.getBoundingClientRect();
    const headerBottomThreshold = 80;

    if (
      headerRect.bottom < headerBottomThreshold &&
      componentRect.bottom > headerBottomThreshold
    ) {
      if (!this.isStickyVisible) {
        this.headerPortalService.setPortalContent(this.stickyTitleTemplate);
        this.isStickyVisible = true;
      }
    } else {
      if (this.isStickyVisible) {
        this.headerPortalService.clearPortalContent();
        this.isStickyVisible = false;
      }
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.checkIfTablet();
  }

  private checkIfTablet() {
    if (isPlatformBrowser(this.platformId)) {
      const width = window.innerWidth;
      this.isTablet = width >= 768;
      this.isDesktop = width >= 1024;
      if (this.isTablet && this.filtersSheetOpen) {
        this.closeFiltersSheet();
      }
      if (!this.isDesktop && this.desktopFiltersPanelVisible) {
        this.closeDesktopFiltersPanel(false);
      }
    }
  }

  private clearFiltersCloseTimer(): void {
    if (!this.closeFiltersTimer) return;
    clearTimeout(this.closeFiltersTimer);
    this.closeFiltersTimer = undefined;
  }

  private clearDesktopFiltersCloseTimer(): void {
    if (!this.closeDesktopFiltersTimer) return;
    clearTimeout(this.closeDesktopFiltersTimer);
    this.closeDesktopFiltersTimer = undefined;
  }

  get displayedProjects() {
    const list = this.filteredProjects;
    if (this.isTablet && !this.showAll) {
      return list.slice(0, this.isDesktop ? 6 : 4);
    }
    return list;
  }

  get showMoreButton() {
    const list = this.filteredProjects;
    const limit = this.isDesktop ? 6 : 4;
    return list.length > limit;
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }
}
