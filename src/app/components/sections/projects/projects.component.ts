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
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SliderComponent } from '../../reusable/slider/slider.component';
import { ProjectCardComponent } from '../../shared/project-card/project-card.component';
import { LanguageService } from '@/app/services/language.service';
import { HeaderPortalService } from '@/app/services/header-portal.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, SliderComponent, ProjectCardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit, OnDestroy {
  languageService = inject(LanguageService);
  private headerPortalService = inject(HeaderPortalService);
  private el = inject(ElementRef);

  isTablet = false;
  isDesktop = false;
  showAll = false;
  private isStickyVisible = false;

  @ViewChild('headerRef') headerRef!: ElementRef;
  @ViewChild('stickyTitleTemplate') stickyTitleTemplate!: TemplateRef<any>;

  projects = [
    {
      title: 'projects.ledWeb',
      image: 'assets/img/projects/led-web/led-web.jpeg',
      technologies: [
        { name: 'Laravel', icon: 'fab fa-laravel' },
        { name: 'React', icon: 'fab fa-react' },
        { name: 'Inertia' },
        { name: 'Tailwind CSS', icon: 'fab fa-css3-alt' },
        { name: 'MySQL', icon: 'fas fa-database' },
        { name: 'Jetstream', icon: 'fas fa-shield-alt' },
      ],
      repoLink: 'https://github.com/Johlevic/led-web',
      repoOnly: true,
    },
    {
      title: 'projects.foroHub',
      image: 'assets/img/projects/foro-hub/apirest-message.png',
      technologies: [
        { name: 'Java 21', icon: 'fab fa-java' },
        { name: 'Spring Boot' },
        { name: 'Spring Security', icon: 'fas fa-shield-alt' },
        { name: 'JWT', icon: 'fas fa-key' },
        { name: 'Spring Data JPA' },
        { name: 'MySQL', icon: 'fas fa-database' },
        { name: 'Flyway', icon: 'fas fa-exchange-alt' },
        { name: 'OpenAPI / Swagger', icon: 'fas fa-book' },
        { name: 'Maven', icon: 'fas fa-cube' },
      ],
      repoLink: 'https://github.com/Johlevic/foro-hub',
      repoOnly: true,
    },
    {
      title: 'projects.literalura',
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
      image: 'assets/img/projects/captura-app/captura-app-ba.png',
      technologies: [
        { name: 'Tauri 2', icon: 'fas fa-desktop' },
        { name: 'Rust', icon: 'fab fa-rust' },
        { name: 'Vite', icon: 'fas fa-bolt' },
        { name: 'HTML', icon: 'fab fa-html5' },
        { name: 'JavaScript', icon: 'fab fa-js' },
        { name: 'Tailwind CSS', icon: 'fab fa-css3-alt' },
        { name: 'pnpm' },
      ],
      repoLink: 'https://github.com/Johlevic/captura-app',
      projectLink:
        'https://github.com/Johlevic/captura-app/raw/main/CapturaApp_0.1.0_x64-setup.exe',
      projectLinkLabelKey: 'projects.downloadDirect',
    },
    {
      title: 'projects.verses',
      image: 'assets/img/projects/verses-bibl/logo-refugio-celestial-best.png',
      technologies: [
        { name: 'React', icon: 'fab fa-react' },
        { name: 'TypeScript', icon: 'fab fa-js' },
        { name: 'JavaScript', icon: 'fab fa-js' },
        { name: 'CSS', icon: 'fab fa-css3-alt' },
        { name: 'Astro' },
        { name: 'PWA' },
      ],
      repoLink: 'https://github.com/Johlevic/versiculos-biblicos',
      projectLink: 'https://versiculos-biblicos.onrender.com/',
    },
    {
      title: 'projects.ditechPeru',
      image: 'assets/img/projects/pantallas-led.png',
      technologies: [
        { name: 'Laravel', icon: 'fab fa-laravel' },
        { name: 'React', icon: 'fab fa-react' },
        { name: 'Inertia' },
        { name: 'Tailwind CSS', icon: 'fab fa-css3-alt' },
        { name: 'MySQL', icon: 'fas fa-database' },
      ],
      repoLink: 'https://github.com/Johlevic/ledpantallas',
      projectLink: 'https://ditechperu.com/',
    },
    {
      title: 'projects.conversorMonedas',
      image: 'assets/img/projects/change-currency/apirest-change.png',
      technologies: [
        { name: 'Java 17+', icon: 'fab fa-java' },
        { name: 'CLI', icon: 'fas fa-terminal' },
        { name: 'MVC' },
        { name: 'ExchangeRate-API' },
        { name: 'HttpClient', icon: 'fas fa-network-wired' },
        { name: 'JSON' },
      ],
      repoLink: 'https://github.com/Johlevic/ChallengeConversorMonedas',
      repoOnly: true,
    },
    {
      title: 'projects.amigoSecreto',
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
    this.checkIfTablet();
  }

  ngOnDestroy() {
    this.headerPortalService.clearPortalContent();
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

    // Show when header is scrolled out AND component is still visible
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
      // Mobile: < 768px (show slider)
      // Tablet: 768px - 1023px (show grid 2 cols)
      // Desktop: >= 1024px (show grid 3 cols)
      this.isTablet = width >= 768;
      this.isDesktop = width >= 1024;
    }
  }

  get displayedProjects() {
    if (this.isTablet && !this.showAll) {
      // Desktop: show 6, Tablet: show 4
      return this.projects.slice(0, this.isDesktop ? 6 : 4);
    }
    return this.projects;
  }

  get showMoreButton() {
    // Desktop: show button if > 6, Tablet: show button if > 4
    const limit = this.isDesktop ? 6 : 4;
    return this.projects.length > limit;
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }
}
