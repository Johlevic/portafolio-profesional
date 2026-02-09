import {
  Component,
  HostListener,
  OnInit,
  Inject,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SliderComponent } from '../../reusable/slider/slider.component';
import { ProjectCardComponent } from '../../shared/project-card/project-card.component';
import { LanguageService } from '@/app/services/language.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, SliderComponent, ProjectCardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  languageService = inject(LanguageService);
  isTablet = false;
  isDesktop = false;
  showAll = false;

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
