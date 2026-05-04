import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  inject,
  afterNextRender,
  Injector,
  runInInjectionContext,
  effect,
  NgZone,
  Input,
  booleanAttribute,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '@/app/services/language.service';
import { BottomSheetService } from '@/app/services/bottom-sheet.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit, OnDestroy {
  /**
   * Cuando es true (p. ej. Sobre mí con fondo de malla), la tarjeta usa fondo opaco
   * para que la red quede solo detrás, no “dentro” del card.
   */
  @Input({ transform: booleanAttribute }) solidOverMesh = false;

  languageService = inject(LanguageService);
  private bottomSheetService = inject(BottomSheetService);
  private injector = inject(Injector);
  private ngZone = inject(NgZone);

  expanded: boolean = false;
  isLargeScreen: boolean = false;
  isSpeaking = false;

  /** Multiplicador de velocidad del motor (1 = normal). Rango típico 0.5–2 en navegadores. */
  speechRate = 1;
  readonly speechRatePresets = [0.8, 1, 1.25, 1.5] as const;

  /** Palabras por minuto aproximadas con rate=1 (heurística para estimar duración). */
  private readonly baseWpmEs = 148;
  private readonly baseWpmEn = 158;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  constructor() {
    afterNextRender(() => {
      runInInjectionContext(this.injector, () => {
        effect(() => {
          this.languageService.currentLanguage();
          if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            this.ngZone.run(() => {
              this.isSpeaking = false;
            });
          }
        });
      });
    });
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  get speechSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof window.speechSynthesis.speak === 'function'
    );
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 1280;
  }

  toggleExpand() {
    if (!this.isLargeScreen) {
      this.bottomSheetService.open({
        title: this.languageService.t('history.title'),
        icon: 'bi bi-person-badge',
        type: 'article',
        items: [
          { value: this.languageService.t('history.p1') },
          { value: this.languageService.t('history.p2') },
          { value: this.languageService.t('history.p3') },
          { value: this.languageService.t('history.p4') },
          { value: this.languageService.t('history.p5') },
        ],
        highlightIndex: 2,
      });
      return;
    }
    this.expanded = !this.expanded;
  }

  toggleVoiceRead(): void {
    if (!this.speechSupported) return;

    if (this.isSpeaking) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      return;
    }

    const text = this.getHistoryPlainText();
    if (!text) return;

    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    const lang = this.languageService.currentLanguage();
    utter.lang = lang === 'es' ? 'es-ES' : 'en-US';
    utter.rate = this.clampSpeechRate(this.speechRate);
    utter.pitch = 1;

    utter.onend = () =>
      this.ngZone.run(() => {
        this.isSpeaking = false;
      });
    utter.onerror = () =>
      this.ngZone.run(() => {
        this.isSpeaking = false;
      });

    this.isSpeaking = true;
    window.speechSynthesis.speak(utter);
  }

  /** Texto completo de la historia sin etiquetas HTML (para síntesis de voz). */
  private getHistoryPlainText(): string {
    const keys = ['history.p1', 'history.p2', 'history.p3', 'history.p4', 'history.p5'] as const;
    const parts = keys.map((k) => this.stripHtml(this.languageService.t(k)));
    return parts.filter(Boolean).join('\n\n');
  }

  private stripHtml(html: string): string {
    if (typeof DOMParser !== 'undefined') {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return (doc.body?.textContent ?? '').replace(/\s+/g, ' ').trim();
    }
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  speechRateOptionLabel(rate: number): string {
    const labelKeys: Record<string, string> = {
      '0.8': 'history.voiceSpeedSlow',
      '1': 'history.voiceSpeedNormal',
      '1.25': 'history.voiceSpeedFast',
      '1.5': 'history.voiceSpeedVeryFast',
    };
    const name = this.languageService.t(
      labelKeys[String(rate)] ?? 'history.voiceSpeedNormal',
    );
    return `${name} (${this.formatDurationEstimate(rate)})`;
  }

  onSpeechSpeedChange(event: Event): void {
    const v = parseFloat((event.target as HTMLSelectElement).value);
    if (!Number.isNaN(v)) {
      this.speechRate = this.clampSpeechRate(v);
    }
  }

  /**
   * Tiempo aproximado de lectura: palabras / (wpm_base × rate).
   * La voz real del navegador puede desviarse; sirve para comparar velocidades entre sí.
   */
  formatDurationEstimate(rate: number): string {
    const sec = Math.max(5, Math.round(this.estimateSecondsAtRate(rate)));
    if (sec < 90) {
      return this.languageService
        .t('history.voiceApproxSec')
        .replace('{0}', String(sec));
    }
    const min = Math.max(1, Math.round(sec / 60));
    return this.languageService
      .t('history.voiceApproxMin')
      .replace('{0}', String(min));
  }

  private estimateSecondsAtRate(rate: number): number {
    const words = this.getHistoryWordCount();
    const base =
      this.languageService.currentLanguage() === 'es'
        ? this.baseWpmEs
        : this.baseWpmEn;
    const r = this.clampSpeechRate(rate);
    return (words / (base * r)) * 60;
  }

  private getHistoryWordCount(): number {
    const text = this.getHistoryPlainText();
    if (!text.trim()) return 0;
    return text.split(/\s+/).filter(Boolean).length;
  }

  private clampSpeechRate(rate: number): number {
    return Math.min(2, Math.max(0.5, rate));
  }
}
