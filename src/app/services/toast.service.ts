import { Injectable, signal } from '@angular/core';

export type ToastType = 'error' | 'success' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  /** Active toasts (newest last). */
  readonly toasts = signal<ToastItem[]>([]);

  private defaultDuration(type: ToastType): number {
    switch (type) {
      case 'error':
        return 8000;
      case 'warning':
        return 7000;
      default:
        return 4500;
    }
  }

  private nextId(): string {
    return `t-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  show(opts: {
    type: ToastType;
    message: string;
    title?: string;
    durationMs?: number;
  }): string {
    const id = this.nextId();
    const item: ToastItem = {
      id,
      type: opts.type,
      title: opts.title?.trim() ?? '',
      message: opts.message,
    };
    this.toasts.update((list) => [...list, item]);
    const ms = opts.durationMs ?? this.defaultDuration(opts.type);
    setTimeout(() => this.dismiss(id), ms);
    return id;
  }

  error(message: string, title?: string, durationMs?: number): string {
    return this.show({ type: 'error', message, title, durationMs });
  }

  success(message: string, title?: string, durationMs?: number): string {
    return this.show({ type: 'success', message, title, durationMs });
  }

  warning(message: string, title?: string, durationMs?: number): string {
    return this.show({ type: 'warning', message, title, durationMs });
  }

  info(message: string, title?: string, durationMs?: number): string {
    return this.show({ type: 'info', message, title, durationMs });
  }

  dismiss(id: string): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
