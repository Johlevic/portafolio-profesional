import { Component, HostListener, inject } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { AboutSectionComponent } from '../sections/about-section/about-section.component';
import { TechnicalskilsComponent } from '../sections/technicalskils/technicalskils.component';
import { ProjectsComponent } from '../sections/projects/projects.component';
import { ExperienceComponent } from '../sections/experience/experience.component';
import { ContactComponent } from '../contact/contact.component';
import { LanguageService } from '@/app/services/language.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    FooterComponent,
    CommonModule,
    AboutSectionComponent,
    TechnicalskilsComponent,
    ProjectsComponent,
    ExperienceComponent,
    ContactComponent,
    ScrollRevealDirective,
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  languageService = inject(LanguageService);

  // === Slider ===
  getTechIcon(tech: string): string {
    const icons: { [key: string]: string } = {
      Angular: 'assets/icon/angular.svg',
      React: 'assets/icon/react.svg',
      'Node.js': 'assets/icon/nodejs.svg',
      'Spring Boot': 'assets/icon/spring-boot.svg',
      Laravel: 'assets/icon/laravel.svg',
      Python: 'assets/icon/python.svg',
      'C#': 'assets/icon/csharp.svg',
      JavaScript: 'assets/icon/javascript.svg',
    };
    return icons[tech] || 'code-slash';
  }

  technologies = [
    'Angular',
    'React',
    'Node.js',
    'Spring Boot',
    'Laravel',
    'Python',
    'C#',
    'JavaScript',
  ];

  currentIndex = 0;
  intervalId: any;

  get totalPages(): number {
    return Math.ceil(this.technologies.length / 2);
  }

  isMobileOrTablet(): boolean {
    return window.innerWidth <= 1024;
  }

  ngOnInit() {
    this.startAutoPlay();
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    if (this.isMobileOrTablet()) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }
  };

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.totalPages;
  }

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.totalPages) % this.totalPages;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  startAutoPlay() {
    if (this.isMobileOrTablet() && !this.intervalId) {
      this.intervalId = setInterval(() => this.nextSlide(), 3000);
    }
  }

  stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // === Flecha scroll hacia arriba ===
  showScrollButton = false;
  private lastScrollTop = 0;
  private scrollThreshold = 200; // px desde arriba
  private directionThreshold = 10; // sensibilidad

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const current = window.pageYOffset || document.documentElement.scrollTop;
    const delta = current - this.lastScrollTop;

    if (Math.abs(delta) < this.directionThreshold) {
      return;
    }

    if (delta > 0 && current > this.scrollThreshold) {
      this.showScrollButton = true;
    } else {
      this.showScrollButton = false;
    }

    this.lastScrollTop = current <= 0 ? 0 : current;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.showScrollButton = false;
  }
}
