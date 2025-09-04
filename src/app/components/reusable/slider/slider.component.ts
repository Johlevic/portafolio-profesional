import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Importa CommonModule
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

  currentSlideIndex = 0;
  cardsVisible = 1; // Número de tarjetas que caben en pantalla
  @Input() projects: Project[] = [];

  public sampleProjects: Project[] = [
    {
      title: 'E-Commerce para Pantallas LED',
      image: 'assets/img/projects/pantallas-led.png',
      technologies: ['Angular', 'TypeScript', 'SCSS'],
      repoLink: 'https://github.com/tu-usuario/tu-repositorio-portfolio',
      projectLink: 'https://tu-portfolio.com'
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
    this.updateCardsVisible();
    this.scrollToSlide();

    this.startAutoplay();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', () => {
      this.updateCardsVisible();
      this.scrollToSlide(); // Ajustar scroll si cambia el número de tarjetas
    });
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    window.removeEventListener('resize', () => {});
  }

  // Calcula cuántas tarjetas caben en el contenedor
  updateCardsVisible(): void {
    const wrapper = this.sliderWrapper.nativeElement;
    const card = wrapper.children[0];
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = parseFloat(getComputedStyle(wrapper).gap) || 0;
    const containerWidth = wrapper.offsetWidth;

    this.cardsVisible = Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));
  }

  // Desplaza al grupo de tarjetas actual
  private scrollToSlide(): void {
    const wrapper = this.sliderWrapper.nativeElement;
    const card = wrapper.children[0];
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = parseFloat(getComputedStyle(wrapper).gap) || 0;
    const scrollPosition = this.currentSlideIndex * (cardWidth + gap);

    // Evitar desbordamiento
    const maxScroll = wrapper.scrollWidth - wrapper.offsetWidth;
    const safeScroll = Math.min(scrollPosition, maxScroll);

    wrapper.scrollTo({
      left: safeScroll,
      behavior: 'smooth'
    });
  }

  nextSlide(): void {
    const maxIndex = this.projects.length - this.cardsVisible;
    this.currentSlideIndex = Math.min(this.currentSlideIndex + this.cardsVisible, maxIndex);
    this.scrollToSlide();
  }

  prevSlide(): void {
    this.currentSlideIndex = Math.max(this.currentSlideIndex - this.cardsVisible, 0);
    this.scrollToSlide();
  }

  goToSlide(index: number): void {
    const maxIndex = this.projects.length - this.cardsVisible;
    this.currentSlideIndex = Math.min(index, maxIndex);
    this.scrollToSlide();
  }

  startAutoplay(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
      if (this.currentSlideIndex >= this.projects.length - this.cardsVisible) {
        this.currentSlideIndex = 0;
        this.scrollToSlide();
      }
    }, 5000);
  }
}
