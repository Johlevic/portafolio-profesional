import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Primera visita al portafolio: hasta que el usuario pulse "Entrar",
 * {@link hasSeenWelcome} es false. Tras marcar, persiste en localStorage.
 */
@Injectable({
  providedIn: 'root',
})
export class WelcomeStorageService {
  private readonly platformId = inject(PLATFORM_ID);
  /** Bump si cambias por completo la pantalla de bienvenida y quieres mostrarla otra vez a quien ya la vio. */
  private readonly key = 'portfolio_welcome_dismissed_v1';

  hasSeenWelcome(): boolean {
    if (!isPlatformBrowser(this.platformId)) return true;
    try {
      return localStorage.getItem(this.key) === '1';
    } catch {
      return true;
    }
  }

  markWelcomeSeen(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(this.key, '1');
    } catch {
      /* modo privado / bloqueo */
    }
  }
}
