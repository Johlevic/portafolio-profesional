import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ProjectCardComponent } from '../../shared/project-card/project-card.component';

export interface Technology {
  name: string;
  icon?: string;
}

export interface Project {
  title: string;
  image: string;
  technologies: Technology[];
  repoLink: string;
  projectLink: string;
}

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, CarouselModule, ProjectCardComponent],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() projects: Project[] = [];
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  isReady = false;
  private resizeObserver: any;

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplaySpeed: 1000,
    autoplayTimeout: 5000,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    dotsData: false, // Use standard dots
    navSpeed: 700,
    navText: ['', ''],
    margin: 24, // Consistent spacing between items
    nav: false,
    autoplayHoverPause: true,
    autoWidth: false,
    items: 3, // Default, will be overwritten by ResizeObserver
  };

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    if (this.projects.length === 0) {
      this.projects = this.sampleProjects;
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initResizeObserver();
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private initResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        this.calculateItems(entry.contentRect.width);
      }
    });

    if (this.carouselContainer) {
      this.resizeObserver.observe(this.carouselContainer.nativeElement);
    }
  }

  private calculateItems(width: number) {
    let items = 1;
    if (width >= 1024) {
      items = 3;
    } else if (width >= 640) {
      items = 2;
    }

    // Force re-render of carousel with new options to ensure exact item count
    this.isReady = false; // Briefly hide to reset
    this.cdr.detectChanges();

    this.customOptions = {
      ...this.customOptions,
      items: items,
    };

    setTimeout(() => {
      this.isReady = true;
      this.cdr.detectChanges();
    }, 0);
  }

  trackByFn(index: number, project: Project): string {
    return project.title;
  }

  public sampleProjects: Project[] = [
    {
      title: 'E-Commerce para Pantallas LED',
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
      title: 'Sistema de Gestión de Clientes',
      image: 'assets/img/projects/apirest.png',
      technologies: [
        { name: 'React', icon: 'fab fa-react' },
        { name: 'Node.js', icon: 'fab fa-node' },
        { name: 'MongoDB', icon: 'fas fa-database' },
      ],
      repoLink: 'https://github.com/tu-usuario/tu-repositorio-crm',
      projectLink: 'https://tu-proyecto-crm.com',
    },
  ];
}
