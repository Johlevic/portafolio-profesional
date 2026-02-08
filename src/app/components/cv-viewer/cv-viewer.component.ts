import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '@/app/services/language.service';
import { ThemeService } from '@/app/services/theme.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
          <a
            [href]="rawCvPath"
            download
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 flex items-center gap-2"
          >
            <i class="bi bi-download"></i>
            <span class="hidden sm:inline">{{
              languageService.t('hero.downloadCV')
            }}</span>
          </a>
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

  safeCvPath!: SafeResourceUrl;
  rawCvPath!: string;

  ngOnInit() {
    this.rawCvPath = this.languageService.t('hero.cvPath');
    this.safeCvPath = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.rawCvPath,
    );
  }
}
