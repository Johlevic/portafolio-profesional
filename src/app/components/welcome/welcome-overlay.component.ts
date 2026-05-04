import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '@/app/services/language.service';
import { ThemeService } from '@/app/services/theme.service';

@Component({
  selector: 'app-welcome-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-[100003] flex flex-col items-center justify-center px-6 py-10 animate-[welcome-fade-in_0.45s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      aria-describedby="welcome-desc"
    >
      <div
        class="absolute inset-0 bg-gray-950/75 dark:bg-black/80 backdrop-blur-md"
        aria-hidden="true"
      ></div>

      <div
        class="relative w-full max-w-lg rounded-3xl border p-8 sm:p-10 shadow-2xl text-center transition-colors"
        [ngClass]="
          themeService.theme() === 'dark'
            ? 'bg-gray-900/95 border-white/10 text-white'
            : 'bg-white/95 border-gray-200/80 text-gray-900'
        "
      >
        <p
          class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-3"
        >
          {{ languageService.t('welcome.kicker') }}
        </p>

        <div class="flex justify-center mb-5">
          <img
            src="assets/img/perfil.jpg"
            alt=""
            class="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg shadow-blue-500/30"
          />
        </div>

        <h1
          id="welcome-title"
          class="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 font-['Orbitron']"
        >
          {{ languageService.t('welcome.title') }}
        </h1>

        <p
          id="welcome-desc"
          class="mt-4 text-sm sm:text-base leading-relaxed"
          [ngClass]="
            themeService.theme() === 'dark'
              ? 'text-gray-300'
              : 'text-gray-600'
          "
        >
          {{ languageService.t('welcome.subtitle') }}
        </p>

        <button
          type="button"
          class="mt-8 w-full sm:w-auto min-w-[220px] inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 text-sm shadow-lg shadow-blue-600/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          (click)="closed.emit()"
        >
          {{ languageService.t('welcome.cta') }}
          <i class="bi bi-arrow-right-circle-fill text-lg" aria-hidden="true"></i>
        </button>

        <p
          class="mt-6 text-[11px] sm:text-xs opacity-70"
          [ngClass]="
            themeService.theme() === 'dark'
              ? 'text-gray-400'
              : 'text-gray-500'
          "
        >
          {{ languageService.t('welcome.hint') }}
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes welcome-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  ],
})
export class WelcomeOverlayComponent {
  readonly languageService = inject(LanguageService);
  readonly themeService = inject(ThemeService);

  readonly closed = output<void>();
}
