import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '@/app/services/language.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cv-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="h-screen w-full flex flex-col bg-gray-900 border-none m-0 p-0 overflow-hidden"
    >
      <!-- Toolbar -->
      <div
        class="h-16 bg-gray-800/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-50"
      >
        <div class="flex items-center gap-4">
          <a
            routerLink="/"
            class="text-white hover:text-blue-400 transition-colors flex items-center gap-2 font-medium"
          >
            <i class="bi bi-arrow-left text-xl"></i>
            <span class="hidden sm:inline">{{
              languageService.t('nav.home')
            }}</span>
          </a>
          <div class="h-6 w-px bg-white/10 hidden sm:block"></div>
          <h1
            class="text-white/90 font-semibold truncate max-w-[200px] sm:max-w-none"
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
      <div class="flex-1 w-full bg-gray-800 relative z-10">
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
      iframe {
        background-color: #31353d;
      }
    `,
  ],
})
export class CvViewerComponent implements OnInit {
  languageService = inject(LanguageService);
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
