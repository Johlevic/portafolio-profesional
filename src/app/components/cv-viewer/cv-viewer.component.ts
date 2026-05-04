import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '@/app/services/language.service';
import { ThemeService } from '@/app/services/theme.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastService } from '@/app/services/toast.service';

@Component({
  selector: 'app-cv-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="h-screen w-full flex flex-col border-none m-0 p-0 overflow-hidden transition-colors duration-300"
      [ngClass]="
        themeService.theme() === 'dark' ? 'bg-gray-950' : 'bg-gray-100'
      "
    >
      <!-- Toolbar -->
      <div
        class="h-16 backdrop-blur-md border-b flex items-center justify-between px-6 z-50 transition-colors duration-300"
        [ngClass]="
          themeService.theme() === 'dark'
            ? 'bg-gray-900/80 border-white/10'
            : 'bg-white/80 border-gray-200'
        "
      >
        <div class="flex items-center gap-4">
          <a
            routerLink="/"
            class="transition-colors flex items-center gap-2 font-medium"
            [ngClass]="
              themeService.theme() === 'dark'
                ? 'text-white hover:text-blue-400'
                : 'text-gray-800 hover:text-blue-600'
            "
          >
            <i class="bi bi-arrow-left text-xl"></i>
            <span class="hidden sm:inline">{{
              languageService.t('nav.home')
            }}</span>
          </a>
          <div
            class="h-6 w-px hidden sm:block"
            [ngClass]="
              themeService.theme() === 'dark' ? 'bg-white/10' : 'bg-gray-200'
            "
          ></div>
          <h1
            class="font-semibold truncate max-w-[200px] sm:max-w-none transition-colors duration-300"
            [ngClass]="
              themeService.theme() === 'dark'
                ? 'text-white/90'
                : 'text-gray-800'
            "
          >
            {{ languageService.t('hero.viewCV') }} - Jhony Lezama
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            [disabled]="downloading"
            (click)="downloadCvPdf()"
            class="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:pointer-events-none text-white px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 flex items-center gap-2"
          >
            <i class="bi bi-download"></i>
            <span class="hidden sm:inline">{{
              languageService.t('hero.downloadCV')
            }}</span>
          </button>
        </div>
      </div>

      <!-- PDF Container -->
      <div
        class="flex-1 w-full relative z-10 transition-colors duration-300"
        [ngClass]="
          themeService.theme() === 'dark' ? 'bg-gray-900' : 'bg-gray-200'
        "
      >
        <iframe
          [src]="safeCvPath"
          class="w-full h-full border-none shadow-2xl"
          type="application/pdf"
        >
        </iframe>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        width: 100%;
      }
    `,
  ],
})
export class CvViewerComponent implements OnInit {
  languageService = inject(LanguageService);
  themeService = inject(ThemeService);
  private sanitizer = inject(DomSanitizer);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  safeCvPath!: SafeResourceUrl;
  rawCvPath!: string;
  downloading = false;

  ngOnInit() {
    this.rawCvPath = this.languageService.t('hero.cvPath');
    this.safeCvPath = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.rawCvPath,
    );
  }

  async downloadCvPdf(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.toastService.warning(
        this.languageService.t('toast.offlineBody'),
        this.languageService.t('toast.offlineTitle'),
      );
      return;
    }
    if (this.downloading) return;
    this.downloading = true;
    try {
      const res = await fetch(this.rawCvPath, {
        method: 'GET',
        cache: 'no-store',
      });
      if (res.status === 404) {
        this.toastService.error(
          this.languageService.t('toast.fileNotFoundBody'),
          this.languageService.t('toast.fileNotFoundTitle'),
        );
        return;
      }
      if (!res.ok) {
        this.toastService.error(
          this.languageService.t('toast.downloadFailedBody'),
          this.languageService.t('toast.downloadFailedTitle'),
        );
        return;
      }
      const blob = await res.blob();
      if (!blob || blob.size === 0) {
        this.toastService.error(
          this.languageService.t('toast.fileNotFoundBody'),
          this.languageService.t('toast.fileNotFoundTitle'),
        );
        return;
      }
      const fileName = this.rawCvPath.split('/').pop() || 'cv.pdf';
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      this.toastService.error(
        this.languageService.t('toast.networkBody'),
        this.languageService.t('toast.networkTitle'),
      );
    } finally {
      this.downloading = false;
    }
  }
}
