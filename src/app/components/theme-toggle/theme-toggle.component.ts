import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@/app/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="toggleTheme()"
      class="w-12 h-12 flex items-center justify-center rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-gray-300/30 dark:border-gray-600/30 shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300 group"
      [attr.aria-label]="
        themeService.theme() === 'dark'
          ? 'Cambiar a modo claro'
          : 'Cambiar a modo oscuro'
      "
      title="Cambiar tema"
    >
      <!-- Sol (Light Mode) -->
      <svg
        *ngIf="themeService.theme() === 'dark'"
        class="w-6 h-6 text-yellow-400 group-hover:rotate-90 transition-transform duration-500"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          clip-rule="evenodd"
        />
      </svg>

      <!-- Luna (Dark Mode) -->
      <svg
        *ngIf="themeService.theme() === 'light'"
        class="w-5 h-5 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
        />
      </svg>
    </button>
  `,
  styles: [
    `
      @keyframes spin-slow {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes pulse-slow {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
      }

      .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
      }

      .animate-pulse-slow {
        animation: pulse-slow 3s ease-in-out infinite;
      }

      button:hover .animate-spin-slow {
        animation: spin-slow 2s linear infinite;
      }
    `,
  ],
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
