import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
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
  currentGroupIndex = 0;
  currentSlideIndex = 0;
  cardsVisible = 1;
  @Input() projects: Project[] = [];

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
      image: 'assets/img/projects/portafolio.png',
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

  private intervalId: any;

  constructor() {
    if (this.projects.length === 0) {
      this.projects = this.sampleProjects;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateCardsVisible();
      this.updateCurrentSlideIndex();
      this.startAutoplay();
    });

    window.addEventListener('resize', () => {
      this.updateCardsVisible();
      this.currentGroupIndex = Math.floor(this.currentSlideIndex / this.cardsVisible);
      this.updateCurrentSlideIndex();
    });
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

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    window.removeEventListener('resize', () => {});
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

  private scrollToSlide(): void {
    const wrapper = this.sliderWrapper.nativeElement;
    const card = wrapper.children[0];
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = parseFloat(getComputedStyle(wrapper).gap) || 0;
    const scrollPosition = this.currentSlideIndex * (cardWidth + gap);

    const maxScroll = wrapper.scrollWidth - wrapper.offsetWidth;
    const safeScroll = Math.min(scrollPosition, maxScroll);

    wrapper.scrollTo({
      left: safeScroll,
      behavior: 'smooth'
    });
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
}
