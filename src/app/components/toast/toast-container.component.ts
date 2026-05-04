import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastType } from '@/app/services/toast.service';
import { LanguageService } from '@/app/services/language.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed bottom-4 right-4 left-4 sm:left-auto z-[100002] flex flex-col gap-2 sm:max-w-md sm:w-full pointer-events-none"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md animate-[toast-in_0.28s_ease-out]"
          [ngClass]="panelClass(toast.type)"
          [attr.role]="toast.type === 'error' ? 'alert' : 'status'"
        >
          <span
            class="mt-0.5 shrink-0 text-lg leading-none"
            [attr.aria-hidden]="true"
          >
            <i class="bi" [ngClass]="iconClass(toast.type)"></i>
          </span>
          <div class="min-w-0 flex-1 text-left">
            @if (toast.title) {
              <p
                class="text-sm font-semibold leading-tight mb-0.5"
                [ngClass]="titleClass(toast.type)"
              >
                {{ toast.title }}
              </p>
            }
            <p
              class="text-sm leading-snug"
              [ngClass]="bodyClass(toast.type)"
            >
              {{ toast.message }}
            </p>
          </div>
          <button
            type="button"
            class="shrink-0 -m-1 p-2 rounded-lg opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            [ngClass]="closeBtnClass(toast.type)"
            (click)="toastService.dismiss(toast.id)"
            [attr.aria-label]="languageService.t('common.close')"
          >
            <i class="bi bi-x-lg text-base leading-none"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes toast-in {
        from {
          opacity: 0;
          transform: translateY(8px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `,
  ],
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
  readonly languageService = inject(LanguageService);

  panelClass(type: ToastType): string {
    const base =
      'border shadow-black/10 dark:shadow-black/40 bg-white/95 dark:bg-gray-900/95';
    switch (type) {
      case 'error':
        return `${base} border-red-200 dark:border-red-900/60`;
      case 'success':
        return `${base} border-emerald-200 dark:border-emerald-900/50`;
      case 'warning':
        return `${base} border-amber-200 dark:border-amber-900/50`;
      default:
        return `${base} border-blue-200 dark:border-blue-900/50`;
    }
  }

  iconClass(type: ToastType): string {
    switch (type) {
      case 'error':
        return 'bi-exclamation-octagon-fill text-red-600 dark:text-red-400';
      case 'success':
        return 'bi-check-circle-fill text-emerald-600 dark:text-emerald-400';
      case 'warning':
        return 'bi-exclamation-triangle-fill text-amber-600 dark:text-amber-400';
      case 'info':
        return 'bi-info-circle-fill text-blue-600 dark:text-blue-400';
      default:
        return 'bi-bell text-gray-600';
    }
  }

  titleClass(type: ToastType): string {
    switch (type) {
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'success':
        return 'text-emerald-800 dark:text-emerald-200';
      case 'warning':
        return 'text-amber-900 dark:text-amber-100';
      default:
        return 'text-blue-900 dark:text-blue-100';
    }
  }

  bodyClass(type: ToastType): string {
    switch (type) {
      case 'error':
        return 'text-red-700/95 dark:text-red-200/90';
      case 'success':
        return 'text-emerald-800/90 dark:text-emerald-100/90';
      case 'warning':
        return 'text-amber-900/85 dark:text-amber-100/85';
      default:
        return 'text-blue-900/85 dark:text-blue-100/85';
    }
  }

  closeBtnClass(type: ToastType): string {
    switch (type) {
      case 'error':
        return 'text-red-700 dark:text-red-300 focus-visible:ring-red-500';
      case 'success':
        return 'text-emerald-700 dark:text-emerald-300 focus-visible:ring-emerald-500';
      case 'warning':
        return 'text-amber-900 dark:text-amber-200 focus-visible:ring-amber-500';
      default:
        return 'text-blue-800 dark:text-blue-200 focus-visible:ring-blue-500';
    }
  }
}
