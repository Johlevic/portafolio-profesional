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
      title: 'projects.ecommerce',
      image: 'assets/img/projects/portafolio.png',
      technologies: [
        { name: 'Angular', icon: 'fab fa-angular' },
        { name: 'Firebase', icon: 'fas fa-fire' },
        { name: 'Bootstrap', icon: 'fab fa-bootstrap' },
      ],
      projectLink: 'https://mi-ecommerce-demo.com',
      repoLink: 'https://github.com/miusuario/ecommerce',
    },
    {
      title: 'projects.blog',
      image: 'assets/img/projects/apirest.png',
      technologies: [
        { name: 'React', icon: 'fab fa-react' },
        { name: 'Node.js', icon: 'fab fa-node' },
      ],
      projectLink: 'https://mi-blog.com',
      repoLink: 'https://github.com/miusuario/blog',
    },
    {
      title: 'projects.led',
      image: 'assets/img/projects/pantallas-led.png',
      technologies: [
        { name: 'Laravel', icon: 'fab fa-laravel' },
        { name: 'TypeScript', icon: 'fab fa-js' },
        { name: 'React', icon: 'fab fa-react' },
        { name: 'Tailwind CSS', icon: 'fab fa-css3-alt' },
        { name: 'Inertia' },
      ],
      repoLink: 'https://github.com/Johlevic/ledpantallas',
      projectLink: 'https://ditechperu.com/',
    },
    {
      title: 'projects.crm',
      image: 'assets/img/projects/apirest.png',
      technologies: [
        { name: 'React', icon: 'fab fa-react' },
        { name: 'Node.js', icon: 'fab fa-node' },
        { name: 'MongoDB', icon: 'fas fa-database' },
      ],
      repoLink: 'https://github.com/tu-usuario/tu-repositorio-crm',
      projectLink: 'https://tu-proyecto-crm.com',
    },
    {
      title: 'projects.portfolio',
      image: 'assets/img/projects/portafolio.png',
      technologies: [
        { name: 'Vue.js', icon: 'fab fa-vuejs' },
        { name: 'Firebase', icon: 'fas fa-fire' },
        { name: 'Stripe', icon: 'fab fa-stripe' },
      ],
      repoLink: 'https://github.com/tu-usuario/tu-repositorio-ecommerce',
      projectLink: 'https://tu-tienda-online.com',
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
