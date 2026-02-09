import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HistoryComponent } from '../sections/history/history.component';
import { StudyComponent } from '../sections/study/study.component';
import { TechnicalskilsComponent } from '../sections/technicalskils/technicalskils.component';
import { ProjectsComponent } from '../sections/projects/projects.component';
import { ExperienceComponent } from '../sections/experience/experience.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { LanguageService } from '@/app/services/language.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HistoryComponent,
    StudyComponent,
    TechnicalskilsComponent,
    ProjectsComponent,
    ExperienceComponent,
    ContactComponent,
    ScrollRevealDirective,
  ],
  template: `
    <div class="scroll-container overflow-x-hidden">
      <!-- ✅ Hero Section -->
      <section
        id="inicio"
        class="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 text-gray-800 dark:text-gray-200 min-h-[80vh] flex items-center transition-colors duration-300"
      >
        <div class="container mx-auto px-0 lg:px-4">
          <div
            class="flex flex-col-reverse lg:flex-row items-center justify-center gap-8 lg:gap-16"
          >
            <div
              class="w-full lg:w-2/3 text-center lg:text-left px-2"
              appScrollReveal
            >
              <div class="mb-6">
                <h1
                  class="text-3xl md:text-4xl lg:text-6xl font-medium text-blue-600 dark:text-blue-400 mb-4 font-['Lucida_Sans']"
                >
                  {{ languageService.t('hero.greeting') }}
                  <strong
                    class="text-blue-800 dark:text-blue-200 text-4xl md:text-5xl lg:text-7xl font-extrabold font-['Asimovian'] block sm:inline-block"
                    >Jhony Lezama</strong
                  >
                </h1>
                <h2
                  class="text-2xl lg:text-3xl font-medium text-blue-600 dark:text-blue-500 font-['Orbitron']"
                >
                  {{ languageService.t('hero.role') }}
                </h2>
              </div>
              <p
                class="text-gray-600 dark:text-gray-300 text-sm md:text-base lg:text-lg xl:text-2xl leading-relaxed mb-10 mx-auto lg:mx-0 px-6 md:px-4 lg:px-0"
              >
                {{ languageService.t('hero.description') }}
              </p>

              <div
                class="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 px-6 md:px-4 lg:px-0"
              >
                <a
                  href="https://sysjol.onrender.com/"
                  target="_blank"
                  class="bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-8 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-3 text-sm lg:text-base font-bold active:scale-95"
                >
                  <i class="bi bi-rocket-takeoff-fill text-lg"></i>
                  {{ languageService.t('hero.visitCompany') }}
                </a>

                <a
                  class="bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 py-3.5 px-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 flex items-center justify-center gap-3 text-sm lg:text-base font-semibold active:scale-95"
                  routerLink="/cv"
                >
                  <i class="bi bi-file-earmark-text-fill text-lg"></i>
                  {{ languageService.t('hero.viewCV') }}
                </a>
              </div>
            </div>

            <div
              class="w-full lg:w-1/3 flex flex-col justify-center items-center pb-8 lg:pb-0"
              appScrollReveal
            >
              <figure
                class="relative flex justify-center items-center rounded-xl"
              >
                <img
                  src="assets/img/perfil.jpg"
                  alt="Foto de Jhony Lezama"
                  class="rounded-full object-cover w-40 h-40 md:w-60 md:h-60 border-4 border-blue-500 shadow-xl pointer-events-none"
                />
                <figcaption
                  class="absolute bottom-0 md:bottom-2 px-3 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs md:text-sm rounded-md border-2 border-blue-500 animate-pulse shadow-lg"
                >
                  {{ languageService.t('hero.available') }}
                </figcaption>
              </figure>
              <!-- ✅ Modern Line (visible on mobile/tablet) -->
              <div
                class="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-8 lg:hidden opacity-50"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <!-- ✅ Tecnologías -->
      <section
        id="habilidades"
        class="py-16 bg-gray-100 dark:bg-gray-800 transition-colors duration-300"
      >
        <div class="container mx-auto px-0">
          <h2
            class="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-8"
          >
            {{ languageService.t('about.technologiesTitle') }}
          </h2>

          <div class="relative overflow-hidden lg:hidden">
            <div
              class="flex transition-transform duration-600 ease-in-out"
              [style.transform]="'translateX(-' + currentIndex * 100 + '%)'"
            >
              @for (i of pagesArray; track i) {
                <div class="w-full flex-shrink-0 flex justify-center gap-4 p-4">
                  <span
                    class="flex-1 max-w-[45%] flex items-center justify-center gap-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-white py-4 px-2 rounded-xl shadow-md text-lg font-semibold border border-gray-200 dark:border-transparent"
                  >
                    <img
                      [src]="getTechIcon(technologies[i * 2])"
                      alt=""
                      class="w-8 h-8 tech-icon"
                    />
                    {{ technologies[i * 2] }}
                  </span>
                  @if (i * 2 + 1 < technologies.length) {
                    <span
                      class="flex-1 max-w-[45%] flex items-center justify-center gap-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-white py-4 px-2 rounded-xl shadow-md text-lg font-semibold border border-gray-200 dark:border-transparent"
                    >
                      <img
                        [src]="getTechIcon(technologies[i * 2 + 1])"
                        alt=""
                        class="w-8 h-8 tech-icon"
                      />
                      {{ technologies[i * 2 + 1] }}
                    </span>
                  }
                </div>
              }
            </div>

            <button
              class="absolute top-1/2 -translate-y-1/2 left-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-800 dark:text-white text-2xl w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none shadow-md"
              (click)="prevSlide()"
            >
              &#10094;
            </button>
            <button
              class="absolute top-1/2 -translate-y-1/2 right-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-800 dark:text-white text-2xl w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none shadow-md"
              (click)="nextSlide()"
            >
              &#10095;
            </button>

            <div
              class="flex justify-center gap-2 mt-4 absolute bottom-0 w-full"
            >
              @for (i of pagesArray; track i) {
                <span
                  [class.bg-blue-500]="i === currentIndex"
                  [class.bg-gray-400]="i !== currentIndex"
                  class="w-2 h-2 rounded-full cursor-pointer transition-colors duration-300"
                  (click)="goToSlide(i)"
                ></span>
              }
            </div>
          </div>

          <div class="hidden lg:flex justify-center flex-wrap gap-4 mt-8">
            @for (tech of technologies; track tech) {
              <span
                class="flex items-center gap-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-white py-2 px-4 rounded-xl shadow-md text-xl font-semibold border border-gray-200 dark:border-transparent hover:scale-105 transition-transform duration-300"
              >
                <img
                  [src]="getTechIcon(tech)"
                  alt=""
                  class="w-8 h-8 tech-icon"
                />
                {{ tech }}
              </span>
            }
          </div>
        </div>
      </section>

      <!-- ✅ SECCIONES EXTRA (Móvil - Se muestran por CSS para evitar recreación) -->
      <div class="md:hidden">
        <section
          id="sobre-mi"
          class="bg-white dark:bg-gray-900 transition-colors duration-300 p-4 container mx-auto"
        >
          <app-history></app-history>
          <div class="py-8"></div>
          <app-study></app-study>
        </section>
        <section
          id="habilidades-section"
          class="bg-gray-100 dark:bg-gray-800 transition-colors duration-300 px-4 container mx-auto"
        >
          <app-technicalskils></app-technicalskils>
        </section>
        <section
          id="proyectos"
          class="bg-white dark:bg-gray-900 transition-colors duration-300 px-4 container mx-auto"
        >
          <app-projects></app-projects>
        </section>
        <section
          id="experiencia"
          class="bg-gray-100 dark:bg-gray-800 transition-colors duration-300 px-4 container mx-auto"
        >
          <app-experience></app-experience>
        </section>
        <section
          id="contacto"
          class="bg-white dark:bg-gray-900 transition-colors duration-300 px-4 container mx-auto pt-16 pb-24"
        >
          <app-contact></app-contact>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .tech-icon {
        filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5));
      }
    `,
  ],
})
export class HomeComponent {
  languageService = inject(LanguageService);

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
  isMobile = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.checkIfMobile();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkIfMobile();
  }

  private checkIfMobile() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768; // md breakpoint
    }
  }

  get totalPages(): number {
    return Math.ceil(this.technologies.length / 2);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

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

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

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
    if (!this.intervalId) {
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
