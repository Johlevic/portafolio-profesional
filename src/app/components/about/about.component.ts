import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { HistoryComponent } from "../sections/history/history.component";
import { StudyComponent } from "../sections/study/study.component";
import { TechnicalskilsComponent } from "../sections/technicalskils/technicalskils.component";
import { ProjectsComponent } from "../sections/projects/projects.component";
import { ExperienceComponent } from "../sections/experience/experience.component";
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FooterComponent, CommonModule, HistoryComponent, TechnicalskilsComponent, ProjectsComponent, ExperienceComponent],

  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
getTechIcon(tech: string):string {
  const icons: { [key: string]: string } = {
    'Angular': 'assets/icon/angular.svg',
    'React': 'assets/icon/react.svg',
    'Node.js': 'assets/icon/nodejs.svg',
    'Spring Boot': 'assets/icon/spring-boot.svg',
    'Laravel': 'assets/icon/laravel.svg',
    'Python': 'assets/icon/python.svg',
    'C#': 'assets/icon/csharp.svg',
    'JavaScript': 'assets/icon/javascript.svg',
  };
  return icons[tech] || 'code-slash'; // fallback si no hay ícono
}
  technologies = ['Angular', 'React', 'Node.js', 'Spring Boot', 'Laravel','Python', 'C#', 'JavaScript' ];
  currentIndex = 0;
  intervalId: any;

  // Total de paginas de slider
  get totalPages(): number{
    return Math.ceil(this.technologies.length / 2)
  }



  // Detecta si es móvil o tablet (basado en ancho de ventana)
  isMobileOrTablet(): boolean {
    return window.innerWidth <= 1024; // Ajusta según tus breakpoints
  }

  ngOnInit() {
    this.startAutoPlay();
    // Escuchar cambios de tamaño
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    // Reinicia el slider si cambia el modo
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
    this.currentIndex = (this.currentIndex - 1 + this.totalPages) % this.totalPages;
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
}
