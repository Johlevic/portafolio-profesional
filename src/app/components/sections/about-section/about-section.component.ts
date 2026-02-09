import {
  Component,
  inject,
  ViewChild,
  ElementRef,
  TemplateRef,
  HostListener,
  PLATFORM_ID,
  Inject,
  OnDestroy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HistoryComponent } from '../history/history.component';
import { StudyComponent } from '../study/study.component';
import { LanguageService } from '@/app/services/language.service';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';
import { HeaderPortalService } from '@/app/services/header-portal.service';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [
    CommonModule,
    HistoryComponent,
    StudyComponent,
    ScrollRevealDirective,
  ],
  template: `
    <section
      class="bg-gray-50 dark:bg-gray-900 py-16 lg:py-24 overflow-hidden transition-colors duration-300"
    >
      <div class="container mx-auto px-6 lg:px-12">
        <!-- Header -->
        <div class="text-center mb-16 lg:mb-24" appScrollReveal #headerRef>
          <h1
            class="text-4xl lg:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-6 tracking-tight"
          >
            {{ languageService.t('about.title') }}
          </h1>
          <div
            class="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full mb-8 shadow-sm"
          ></div>
          <p
            class="text-gray-600 dark:text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto font-light leading-relaxed"
          >
            {{ languageService.t('about.description') }}
          </p>
        </div>

        <!-- Layout Grid -->
        <div
          class="grid grid-cols-1 xl:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          <!-- Left Column: Biography -->
          <div class="xl:col-span-7">
            <app-history></app-history>
          </div>

          <!-- Right Column: Education & Stats -->
          <div class="xl:col-span-5">
            <app-study></app-study>
          </div>
        </div>
      </div>
    </section>

    <!-- STICKY TITLE TEMPLATE -->
    <ng-template #stickyTitleTemplate>
      <div
        class="flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700/50 animate-fade-in gap-3"
      >
        <span
          class="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text"
        >
          {{ languageService.t('about.title') }}
        </span>

        <!-- Separator -->
        <div class="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>

        <!-- Subtitle -->
        <span class="text-xs font-medium text-gray-600 dark:text-gray-300">
          {{ currentSubtitle }}
        </span>
      </div>
    </ng-template>
  `,
})
export class AboutSectionComponent implements OnDestroy {
  languageService = inject(LanguageService);
  private headerPortalService = inject(HeaderPortalService);

  @ViewChild('headerRef') headerRef!: ElementRef;
  @ViewChild('stickyTitleTemplate') stickyTitleTemplate!: TemplateRef<any>;

  @ViewChild(HistoryComponent, { read: ElementRef }) historyRef!: ElementRef;
  @ViewChild(StudyComponent, { read: ElementRef }) studyRef!: ElementRef;

  private isStickyVisible = false;
  currentSubtitle: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @HostListener('window:scroll')
  onScroll() {
    if (!isPlatformBrowser(this.platformId) || !this.headerRef) return;

    const headerRect = this.headerRef.nativeElement.getBoundingClientRect();
    const headerBottomThreshold = 80;

    // Sticky Visibility Logic
    if (headerRect.bottom < headerBottomThreshold) {
      if (!this.isStickyVisible) {
        this.headerPortalService.setPortalContent(this.stickyTitleTemplate);
        this.isStickyVisible = true;
      }
      this.updateSubtitle();
    } else {
      if (this.isStickyVisible) {
        this.headerPortalService.clearPortalContent();
        this.isStickyVisible = false;
      }
    }
  }

  private updateSubtitle() {
    const isDesktop = window.innerWidth >= 1280; // xl breakpoint

    if (isDesktop) {
      // Side-by-side layout
      this.currentSubtitle = `${this.languageService.t('history.title')} / ${this.languageService.t('study.title')}`;
    } else {
      // Stacked layout
      if (this.historyRef && this.studyRef) {
        const historyRect =
          this.historyRef.nativeElement.getBoundingClientRect();
        // If history is mostly in view or above center
        const offset = window.innerHeight / 2;

        if (historyRect.bottom > 150) {
          // 150px buffer from top
          this.currentSubtitle = this.languageService.t('history.title'); // "Mi Historia"
        } else {
          this.currentSubtitle = this.languageService.t('study.title'); // "Formación"
        }
      }
    }
  }

  ngOnDestroy() {
    this.headerPortalService.clearPortalContent();
  }
}
