import { Component, inject } from '@angular/core';
import { HistoryComponent } from '../history/history.component';
import { StudyComponent } from '../study/study.component';
import { LanguageService } from '@/app/services/language.service';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [HistoryComponent, StudyComponent],
  template: `
    <section
      class="bg-gray-50 dark:bg-gray-900 py-16 lg:py-24 overflow-hidden transition-colors duration-300"
    >
      <div class="container mx-auto px-6 lg:px-12">
        <!-- Header -->
        <div class="text-center mb-16 lg:mb-24 animate-fade-in">
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
  `,
  styles: `
    .animate-fade-in {
      animation: fadeIn 1.2s ease-out forwards;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
})
export class AboutSectionComponent {
  languageService = inject(LanguageService);
}
