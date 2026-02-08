import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '@/app/services/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      (click)="toggleLanguage()"
      class="relative w-24 h-12 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-gray-300/30 dark:border-gray-600/30 rounded-full shadow-lg flex items-center p-1 cursor-pointer hover:border-blue-500/50 transition-all duration-300 group"
      title="Cambiar idioma / Change language"
    >
      <!-- Sliding Active Background -->
      <div
        class="absolute top-1 bottom-1 w-[42px] rounded-full bg-blue-600/90 dark:bg-blue-500/90 light:bg-blue-500 shadow-md transition-all duration-300 ease-in-out z-0"
        [style.left]="
          languageService.currentLanguage() === 'es'
            ? '4px'
            : 'calc(100% - 46px)'
        "
      ></div>

      <!-- Español Option -->
      <div
        class="flex-1 z-10 flex items-center justify-center transition-opacity duration-300"
        [class.opacity-100]="languageService.currentLanguage() === 'es'"
        [class.opacity-50]="languageService.currentLanguage() !== 'es'"
      >
        <span
          class="text-lg filter drop-shadow-sm leading-none"
          role="img"
          aria-label="Español"
          >🇪🇸</span
        >
        <span
          *ngIf="languageService.currentLanguage() === 'es'"
          class="text-[10px] font-bold text-white ml-1 font-sans"
          >ES</span
        >
      </div>

      <!-- English Option -->
      <div
        class="flex-1 z-10 flex items-center justify-center transition-opacity duration-300"
        [class.opacity-100]="languageService.currentLanguage() === 'en'"
        [class.opacity-50]="languageService.currentLanguage() !== 'en'"
      >
        <span
          *ngIf="languageService.currentLanguage() === 'en'"
          class="text-[10px] font-bold text-white mr-1 font-sans"
          >EN</span
        >
        <span
          class="text-lg filter drop-shadow-sm leading-none"
          role="img"
          aria-label="English"
          >🇺🇸</span
        >
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class LanguageSelectorComponent {
  languageService = inject(LanguageService);

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
