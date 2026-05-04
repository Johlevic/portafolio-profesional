import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
  inject,
  ViewChild,
  ElementRef,
  TemplateRef,
  OnDestroy,
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
import { HeaderPortalService } from '@/app/services/header-portal.service';
import { NeuralMeshLayerComponent } from '../shared/neural-mesh-layer/neural-mesh-layer.component';
import { TypewriterTextComponent } from '../shared/typewriter-text/typewriter-text.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NeuralMeshLayerComponent,
    TypewriterTextComponent,
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
        #headerRef
        class="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 text-gray-800 dark:text-gray-200 min-h-[80vh] flex items-center transition-colors duration-300"
      >
        <app-neural-mesh-layer />
        <div class="relative z-10 container mx-auto px-0 lg:px-4">
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
                  class="text-2xl lg:text-3xl font-medium text-blue-600 dark:text-blue-500 font-['Orbitron'] min-h-[2.5rem] md:min-h-[3rem]"
                >
                  <app-typewriter-text
                    [text]="languageService.t('hero.role')"
                  />
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
                  class="absolute bottom-0 md:bottom-2 px-2 md:px-3 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs md:text-sm rounded-md border-2 border-blue-500 animate-pulse shadow-lg"
                >
                  <span class="md:hidden">{{
                    languageService.t('hero.availableShort')
                  }}</span>
                  <span class="hidden md:inline">{{
                    languageService.t('hero.available')
                  }}</span>
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
            class="mb-4 text-center text-2xl font-bold text-blue-600 dark:text-blue-400 sm:mb-8 sm:text-3xl"
          >
            {{ languageService.t('about.technologiesTitle') }}
          </h2>

          <div class="relative overflow-hidden pb-6 lg:hidden">
            <div
              class="flex transition-transform duration-600 ease-in-out"
              [style.transform]="'translateX(-' + currentIndex * 100 + '%)'"
            >
              @for (i of pagesArray; track i) {
                <div
                  class="flex w-full flex-shrink-0 justify-center gap-2 px-1.5 py-2 sm:gap-4 sm:p-4"
                >
                  <span
                    class="flex min-h-0 min-w-0 max-w-[48%] flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 px-1.5 py-2 text-xs font-semibold text-gray-800 shadow-sm dark:border-transparent dark:from-gray-700 dark:to-gray-800 dark:text-white sm:max-w-[45%] sm:gap-2 sm:rounded-xl sm:px-2 sm:py-4 sm:text-lg sm:shadow-md"
                  >
                    <img
                      [src]="getTechIcon(technologies[i * 2])"
                      alt=""
                      class="h-6 w-6 shrink-0 tech-icon sm:h-8 sm:w-8"
                    />
                    <span class="truncate">{{ technologies[i * 2] }}</span>
                  </span>
                  @if (i * 2 + 1 < technologies.length) {
                    <span
                      class="flex min-h-0 min-w-0 max-w-[48%] flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 px-1.5 py-2 text-xs font-semibold text-gray-800 shadow-sm dark:border-transparent dark:from-gray-700 dark:to-gray-800 dark:text-white sm:max-w-[45%] sm:gap-2 sm:rounded-xl sm:px-2 sm:py-4 sm:text-lg sm:shadow-md"
                    >
                      <img
                        [src]="getTechIcon(technologies[i * 2 + 1])"
                        alt=""
                        class="h-6 w-6 shrink-0 tech-icon sm:h-8 sm:w-8"
                      />
                      <span class="truncate">{{
                        technologies[i * 2 + 1]
                      }}</span>
                    </span>
                  }
                </div>
              }
            </div>

            <button
              type="button"
              class="absolute left-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-sm leading-none text-gray-800 shadow backdrop-blur-sm transition-all duration-300 hover:bg-gray-100 focus:outline-none dark:bg-gray-700/90 dark:text-white dark:hover:bg-gray-600 sm:left-4 sm:h-10 sm:w-10 sm:text-2xl"
              (click)="prevSlide()"
              [attr.aria-label]="
                languageService.t('about.techCarouselPrev')
              "
            >
              &#10094;
            </button>
            <button
              type="button"
              class="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-sm leading-none text-gray-800 shadow backdrop-blur-sm transition-all duration-300 hover:bg-gray-100 focus:outline-none dark:bg-gray-700/90 dark:text-white dark:hover:bg-gray-600 sm:right-4 sm:h-10 sm:w-10 sm:text-2xl"
              (click)="nextSlide()"
              [attr.aria-label]="
                languageService.t('about.techCarouselNext')
              "
            >
              &#10095;
            </button>

            <div
              class="absolute bottom-0 flex w-full justify-center gap-1.5 pt-1"
            >
              @for (i of pagesArray; track i) {
                <span
                  [class.bg-blue-500]="i === currentIndex"
                  [class.bg-gray-400]="i !== currentIndex"
                  class="h-1.5 w-1.5 cursor-pointer rounded-full transition-colors duration-300 sm:h-2 sm:w-2"
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

    <!-- STICKY TITLE TEMPLATE -->
    <ng-template #stickyTitleTemplate>
      <div
        class="flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700/50 animate-fade-in"
      >
        <span
          class="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text"
        >
          {{ languageService.t('nav.home') }}
        </span>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .tech-icon {
        filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5));
      }
    `,
  ],
})
export class HomeComponent implements OnDestroy {
  languageService = inject(LanguageService);
  private headerPortalService = inject(HeaderPortalService);
  private el = inject(ElementRef);

  @ViewChild('headerRef') headerRef!: ElementRef;
  @ViewChild('stickyTitleTemplate') stickyTitleTemplate!: TemplateRef<any>;

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
  isDesktop = false;
  private isStickyVisible = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.checkIfMobile();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkIfMobile();
  }

  private checkIfMobile() {
    if (isPlatformBrowser(this.platformId)) {
      const width = window.innerWidth;
      this.isMobile = width < 768;
      this.isDesktop = width >= 1024;
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    this.headerPortalService.clearPortalContent();
  }

  @HostListener('window:scroll')
  onScroll() {
    // Desktop only for Home sticky
    if (
      !this.isDesktop ||
      !isPlatformBrowser(this.platformId) ||
      !this.headerRef
    )
      return;

    const headerRect = this.headerRef.nativeElement.getBoundingClientRect();
    const componentRect = this.el.nativeElement.getBoundingClientRect();
    const headerBottomThreshold = 80;

    // Show when header (Hero) is scrolled out AND wrapper is still visible
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
