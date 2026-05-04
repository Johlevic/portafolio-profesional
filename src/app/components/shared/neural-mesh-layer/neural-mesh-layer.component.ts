import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ThemeService } from '@/app/services/theme.service';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * Fondo animado tipo red neuronal (nodos, vecinos, enlaces largos aleatorios, cursor).
 * Colocar dentro de un contenedor **`position: relative; overflow: hidden`** y el contenido
 * en un hijo con **`position: relative; z-index: 10`** (o similar). `pointer-events: none`.
 */
@Component({
  selector: 'app-neural-mesh-layer',
  standalone: true,
  template: `
    <canvas
      #cv
      class="absolute inset-0 block h-full w-full"
      aria-hidden="true"
    ></canvas>
  `,
  styles: [
    `
      :host {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
      }
    `,
  ],
})
export class NeuralMeshLayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cv', { static: true }) cv!: ElementRef<HTMLCanvasElement>;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly theme = inject(ThemeService);

  private ctx!: CanvasRenderingContext2D;
  private list: Particle[] = [];
  private w = 0;
  private h = 0;
  private raf = 0;
  private reduced = false;
  private resizeObs?: ResizeObserver;
  private longLinks: Array<[number, number]> = [];
  private ptrX: number | null = null;
  private ptrY: number | null = null;
  /** Ancho menor que 768px: pocos nodos, malla más dispersa y fina. */
  private compact = false;

  ngAfterViewInit(): void {
    const el = this.cv.nativeElement;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;
    this.reduced =
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resize();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObs = new ResizeObserver(() => this.resize());
      this.resizeObs.observe(this.host.nativeElement);
    }
    this.zone.runOutsideAngular(() => {
      const loop = () => {
        this.tick();
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.resizeObs?.disconnect();
  }

  @HostListener('window:resize')
  onWinResize(): void {
    this.resize();
  }

  @HostListener('document:mousemove', ['$event'])
  onDocMove(ev: MouseEvent): void {
    const el = this.host.nativeElement;
    const r = el.getBoundingClientRect();
    if (
      ev.clientX >= r.left &&
      ev.clientX <= r.right &&
      ev.clientY >= r.top &&
      ev.clientY <= r.bottom
    ) {
      this.ptrX = ev.clientX - r.left;
      this.ptrY = ev.clientY - r.top;
    } else {
      this.ptrX = null;
      this.ptrY = null;
    }
  }

  private resize(): void {
    const hostEl = this.host.nativeElement;
    const rect = hostEl.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nw = Math.max(1, Math.floor(rect.width));
    const nh = Math.max(1, Math.floor(rect.height));
    if (nw === this.w && nh === this.h && this.list.length > 0) {
      return;
    }
    this.w = nw;
    this.h = nh;
    this.compact = nw < 768;
    const canvas = this.cv.nativeElement;
    canvas.width = Math.floor(this.w * dpr);
    canvas.height = Math.floor(this.h * dpr);
    canvas.style.width = `${this.w}px`;
    canvas.style.height = `${this.h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.spawn();
  }

  private spawn(): void {
    const area = this.w * this.h;
    const c = this.compact;
    const n = c
      ? Math.max(14, Math.min(24, Math.floor(area / 52000)))
      : Math.max(44, Math.min(86, Math.floor(area / 13500)));
    this.list = [];
    for (let i = 0; i < n; i++) {
      this.list.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        vx: (Math.random() - 0.5) * (this.reduced ? 0 : c ? 0.26 : 0.42),
        vy: (Math.random() - 0.5) * (this.reduced ? 0 : c ? 0.26 : 0.42),
        r: c ? 0.75 + Math.random() * 0.95 : 1.1 + Math.random() * 2.1,
      });
    }

    const minLongDist = Math.min(this.w, this.h) * (c ? 0.32 : 0.22);
    const want = c
      ? Math.min(6, Math.max(3, Math.floor(n * 0.18)))
      : Math.min(48, Math.max(12, Math.floor(n * 0.2)));
    const seen = new Set<string>();
    this.longLinks = [];
    let tries = 0;
    while (this.longLinks.length < want && tries < 900) {
      tries++;
      const i = Math.floor(Math.random() * n);
      const j = Math.floor(Math.random() * n);
      if (i === j) continue;
      const lo = Math.min(i, j);
      const hi = Math.max(i, j);
      const key = `${lo}-${hi}`;
      if (seen.has(key)) continue;
      const a = this.list[lo];
      const b = this.list[hi];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < minLongDist) continue;
      seen.add(key);
      this.longLinks.push([lo, hi]);
    }
  }

  private tick(): void {
    const ctx = this.ctx;
    const dark = this.theme.theme() === 'dark';
    ctx.clearRect(0, 0, this.w, this.h);

    const c = this.compact;
    const vmax = c ? 0.42 : 0.62;
    const jitter = c ? 0.016 : 0.028;
    if (!this.reduced) {
      for (const p of this.list) {
        p.vx += (Math.random() - 0.5) * jitter;
        p.vy += (Math.random() - 0.5) * jitter;
        p.vx *= 0.9965;
        p.vy *= 0.9965;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > vmax) {
          p.vx = (p.vx / sp) * vmax;
          p.vy = (p.vy / sp) * vmax;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > this.w) p.vx *= -1;
        if (p.y < 0 || p.y > this.h) p.vy *= -1;
        p.x = Math.min(this.w, Math.max(0, p.x));
        p.y = Math.min(this.h, Math.max(0, p.y));
      }
    }

    const t = performance.now();
    const breathe = 0.82 + Math.sin(t * 0.0018) * 0.18;
    const maxD = c
      ? dark
        ? 88
        : 76
      : dark
        ? 168
        : 138;
    const coreD = maxD * (c ? 0.34 : 0.38);
    const lim = this.list.length;
    const diag = Math.hypot(this.w, this.h) || 1;

    const drawLongAxon = (a: Particle, b: Particle) => {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const tDist = Math.max(0, 1 - d / (diag * (c ? 0.58 : 0.72)));
      const alpha =
        tDist * tDist * (dark ? 0.11 : 0.07) * breathe * (c ? 0.55 : 1);
      if (alpha < 0.012) return;
      ctx.beginPath();
      ctx.strokeStyle = dark
        ? `rgba(103, 232, 249, ${alpha})`
        : `rgba(59, 130, 246, ${alpha})`;
      ctx.lineWidth = c ? (dark ? 0.38 : 0.35) : dark ? 0.55 : 0.5;
      ctx.lineCap = 'round';
      ctx.setLineDash(c ? [3, 9] : [4, 7]);
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    for (const [i, j] of this.longLinks) {
      const a = this.list[i];
      const b = this.list[j];
      if (a && b) drawLongAxon(a, b);
    }

    const drawSynapse = (
      a: Particle,
      b: Particle,
      d: number,
      strong: boolean,
    ) => {
      const falloff = 1 - d / maxD;
      const base = falloff * falloff * 0.35 + falloff * 0.42;
      const alpha =
        base *
        breathe *
        (dark ? 1 : 0.72) *
        (strong ? 1.35 : 1) *
        (c ? 0.62 : 1);
      const cap = (dark ? 0.52 : 0.38) * (c ? 0.65 : 1);
      const aClamped = Math.min(cap, alpha);
      ctx.beginPath();
      ctx.strokeStyle = dark
        ? `rgba(56, 211, 253, ${aClamped})`
        : `rgba(37, 99, 235, ${aClamped})`;
      const lw = strong ? (dark ? 1.35 : 1.05) : dark ? 0.95 : 0.75;
      ctx.lineWidth = c ? lw * 0.65 : lw;
      ctx.lineCap = 'round';
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    };

    for (let i = 0; i < lim; i++) {
      for (let j = i + 1; j < lim; j++) {
        const a = this.list[i];
        const b = this.list[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d >= maxD) continue;
        const strong = d < coreD;
        drawSynapse(a, b, d, strong);
        if (strong) {
          ctx.beginPath();
          const glowA = Math.min(
            0.35,
            (1 - d / coreD) * 0.28 * breathe * (c ? 0.55 : 1),
          );
          ctx.strokeStyle = dark
            ? `rgba(165, 243, 252, ${glowA})`
            : `rgba(96, 165, 250, ${glowA * 0.9})`;
          ctx.lineWidth = c ? (dark ? 1.35 : 1.15) : dark ? 2.4 : 2;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    if (this.ptrX != null && this.ptrY != null && !this.reduced) {
      const cx = this.ptrX;
      const cy = this.ptrY;
      const reach = c ? (dark ? 82 : 70) : dark ? 152 : 128;
      for (const p of this.list) {
        const d = Math.hypot(p.x - cx, p.y - cy);
        if (d >= reach) continue;
        const u = 1 - d / reach;
        const alpha = Math.min(
          0.58,
          u * u * (dark ? 0.52 : 0.36) * breathe * 1.15 * (c ? 0.55 : 1),
        );
        ctx.beginPath();
        ctx.strokeStyle = dark
          ? `rgba(125, 250, 255, ${alpha})`
          : `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = c ? (dark ? 0.65 : 0.55) : dark ? 1.1 : 0.9;
        ctx.lineCap = 'round';
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(cx, cy);
        ctx.stroke();
      }
      const hubPulse = (c ? 2.1 : 3.2) + Math.sin(t * 0.0055) * (c ? 0.55 : 1.1);
      ctx.beginPath();
      ctx.arc(cx, cy, hubPulse, 0, Math.PI * 2);
      ctx.fillStyle = dark
        ? `rgba(207, 250, 254, ${(0.28 + breathe * 0.12) * (c ? 0.65 : 1)})`
        : `rgba(125, 211, 252, ${(0.35 + breathe * 0.1) * (c ? 0.65 : 1)})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, c ? 1.1 : 1.6, 0, Math.PI * 2);
      ctx.fillStyle = dark ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.95)';
      ctx.fill();
    }

    for (const p of this.list) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      if (dark) {
        ctx.fillStyle = `rgba(224, 242, 254, ${(0.42 + (p.r % 1) * 0.28) * (c ? 0.75 : 1)})`;
        ctx.shadowColor = 'rgba(34, 211, 238, 0.75)';
        ctx.shadowBlur = c ? 6 : 14;
      } else {
        ctx.fillStyle = `rgba(37, 99, 235, ${(0.28 + (p.r % 1) * 0.22) * (c ? 0.8 : 1)})`;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.45)';
        ctx.shadowBlur = c ? 5 : 10;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
}
