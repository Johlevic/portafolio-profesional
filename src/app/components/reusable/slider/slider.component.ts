import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Project {
  title: string;
  image: string;
  technologies: string[];
  repoLink: string;
  projectLink: string;
}

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sliderWrapper') sliderWrapper!: ElementRef;
  @Input() projects: Project[] = [];

  currentGroupIndex = 0;
  currentSlideIndex = 0;
  cardsVisible = 1;
  private intervalId: any;

  // 👉 swipe táctil
  private startX: number = 0;
  private endX: number = 0;

  // 👉 proyectos demo si no llegan como input
  public sampleProjects: Project[] = [
    {
      title: 'E-Commerce para Pantallas LED',
      image: 'assets/img/projects/pantallas-led.png',
      technologies: ['Laravel', 'TypeScript', 'React', 'Tailwind CSS', 'Inertia'],
      repoLink: 'https://github.com/Johlevic/ledpantallas',
      projectLink: 'https://ditechperu.com/'
    },
    {
      title: 'Sistema de Gestión de Clientes',
      image: 'assets/img/projects/apirest.png',
      technologies: ['React', 'Node.js', 'MongoDB'],
      repoLink: 'https://github.com/tu-usuario/tu-repositorio-crm',
      projectLink: 'https://tu-proyecto-crm.com'
    },
    {
      title: 'Portafolio Personal',
      image: 'assets/img/projects/portafolio.png',
      technologies: ['Vue.js', 'Firebase', 'Stripe'],
      repoLink: 'https://github.com/tu-usuario/tu-repositorio-ecommerce',
      projectLink: 'https://tu-tienda-online.com'
    },
    {
      title: 'Aplicación de Tareas',
      image: 'assets/img/projects/pantallasled-pro.png',
      technologies: ['Angular', 'NgRx', 'Tailwind CSS'],
      repoLink: 'https://github.com/tu-usuario/tu-repositorio-todo',
      projectLink: 'https://tu-aplicacion-de-tareas.com'
    },
    {
      title: 'Blog de Recetas',
      image: 'assets/img/projects/portafolio.png',
      technologies: ['Next.js', 'GraphQL', 'Prisma'],
      repoLink: 'https://github.com/tu-usuario/tu-repositorio-recetas',
      projectLink: 'https://tu-blog-de-recetas.com'
    }
  ];

  constructor(private cdr: ChangeDetectorRef) {
    if (this.projects.length === 0) {
      this.projects = this.sampleProjects;
    }
  }

  ngAfterViewInit() {
    this.updateCardsVisible();
    this.updateCurrentSlideIndex();
    this.startAutoplay();

    // 🔧 evita ExpressionChangedAfterItHasBeenCheckedError
    this.cdr.detectChanges();

    window.addEventListener('resize', () => {
      this.updateCardsVisible();
      this.currentGroupIndex = Math.floor(this.currentSlideIndex / this.cardsVisible);
      this.updateCurrentSlideIndex();
    });

    // 👉 eventos táctiles
    const wrapper = this.sliderWrapper.nativeElement;
    wrapper.addEventListener('touchstart', (e: TouchEvent) => {
      this.startX = e.touches[0].clientX;
      this.pauseAutoplay();
    });

    wrapper.addEventListener('touchmove', (e: TouchEvent) => {
      this.endX = e.touches[0].clientX;
    });

    wrapper.addEventListener('touchend', () => {
      const diff = this.startX - this.endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.nextSlide(); // swipe izquierda → siguiente
        } else {
          this.prevSlide(); // swipe derecha → anterior
        }
      }
      this.startX = 0;
      this.endX = 0;
      this.resumeAutoplay();
    });
  }

  ngOnDestroy() {
    this.pauseAutoplay();
    window.removeEventListener('resize', () => {});
  }

  private updateCurrentSlideIndex(): void {
    this.currentSlideIndex = this.currentGroupIndex * this.cardsVisible;

    const wrapper = this.sliderWrapper.nativeElement;
    const maxScroll = wrapper.scrollWidth - wrapper.offsetWidth;
    const card = wrapper.children[0];
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = parseFloat(getComputedStyle(wrapper).gap) || 0;
    const scrollPosition = this.currentSlideIndex * (cardWidth + gap);

    wrapper.scrollTo({
      left: Math.min(scrollPosition, maxScroll),
      behavior: 'smooth'
    });
  }

  updateCardsVisible(): void {
    const wrapper = this.sliderWrapper.nativeElement;
    const card = wrapper.children[0];
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = parseFloat(getComputedStyle(wrapper).gap) || 0;
    const containerWidth = wrapper.offsetWidth;

    this.cardsVisible = Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));
  }

  nextSlide(): void {
    if (this.currentGroupIndex < this.totalGroups - 1) {
      this.currentGroupIndex++;
    } else {
      this.currentGroupIndex = 0;
    }
    this.updateCurrentSlideIndex();
  }

  prevSlide(): void {
    if (this.currentGroupIndex > 0) {
      this.currentGroupIndex--;
    } else {
      this.currentGroupIndex = this.totalGroups - 1;
    }
    this.updateCurrentSlideIndex();
  }

  get totalGroups(): number {
    return Math.ceil(this.projects.length / this.cardsVisible);
  }

  goToSlide(index: number): void {
    this.currentGroupIndex = index;
    this.updateCurrentSlideIndex();
  }

  startAutoplay(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  pauseAutoplay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resumeAutoplay(): void {
    if (!this.intervalId) {
      this.startAutoplay();
    }
  }
}
