import {
  Component,
  OnInit,
  inject,
  signal,
  PLATFORM_ID,
  computed,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '@/app/services/language.service';

const SUPPORTED = new Set([
  400, 401, 403, 404, 405, 408, 409, 410, 413, 415, 429, 500, 501, 502, 503,
  504,
]);

@Component({
  selector: 'app-http-error-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section
      class="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center px-6 py-16 text-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors"
      aria-labelledby="http-error-title"
    >
      <p
        class="font-['Orbitron'] text-7xl sm:text-8xl font-black tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 select-none"
        aria-hidden="true"
      >
        {{ displayCode() }}
      </p>
      <h1
        id="http-error-title"
        class="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white max-w-lg"
      >
        {{ languageService.t(titleKey()) }}
      </h1>
      <p
        class="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md leading-relaxed"
      >
        {{ languageService.t(bodyKey()) }}
      </p>

      <div
        class="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none justify-center"
      >
        <a
          routerLink="/"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 text-sm shadow-lg shadow-blue-600/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        >
          <i class="bi bi-house-door-fill" aria-hidden="true"></i>
          {{ languageService.t('errors.backHome') }}
        </a>
        <a
          routerLink="/contacto"
          class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800/80 text-gray-800 dark:text-gray-100 font-semibold px-6 py-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        >
          <i class="bi bi-envelope-fill" aria-hidden="true"></i>
          {{ languageService.t('errors.goContact') }}
        </a>
        @if (showRetry()) {
          <button
            type="button"
            (click)="reloadPage()"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100 font-semibold px-6 py-3 text-sm hover:bg-amber-100 dark:hover:bg-amber-950/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          >
            <i class="bi bi-arrow-clockwise" aria-hidden="true"></i>
            {{ languageService.t('errors.tryAgain') }}
          </button>
        }
      </div>

      <p
        class="mt-12 text-xs text-gray-400 dark:text-gray-500 font-mono"
        aria-live="polite"
      >
        HTTP {{ displayCode() }}
      </p>
    </section>
  `,
})
export class HttpErrorPageComponent implements OnInit {
  readonly languageService = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  /** Normalized HTTP-style status (e.g. 404). */
  readonly status = signal(404);

  readonly displayCode = computed(() => this.status());

  readonly titleKey = computed(() => {
    const c = this.status();
    return SUPPORTED.has(c) ? `errors.e${c}.title` : 'errors.generic.title';
  });

  readonly bodyKey = computed(() => {
    const c = this.status();
    return SUPPORTED.has(c) ? `errors.e${c}.body` : 'errors.generic.body';
  });

  /** Server / gateway errors: offer reload. */
  readonly showRetry = computed(() => {
    const c = this.status();
    return c >= 500 && c <= 599;
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pm) => {
        const raw = pm.get('code') ?? '404';
        const match = raw.match(/\d{1,3}/);
        const parsed = match ? parseInt(match[0], 10) : NaN;
        if (!Number.isFinite(parsed) || parsed < 100 || parsed > 599) {
          this.status.set(404);
          return;
        }
        this.status.set(parsed);
      });
  }

  reloadPage(): void {
    if (isPlatformBrowser(this.platformId)) {
      globalThis.location?.reload();
    }
  }
}
