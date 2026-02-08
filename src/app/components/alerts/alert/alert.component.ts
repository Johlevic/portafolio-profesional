import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 necesario para *ngIf, ngClass, etc.

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule], // 👈 agrégalo aquí
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  @Input() type: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info';
  @Input() title = '';
  @Input() message = '';
  @Input() autoClose = true;
  @Output() closed = new EventEmitter<void>();

  get iconClass() {
    switch (this.type) {
      case 'success':
        return 'bi bi-check-circle-fill text-green-400';
      case 'error':
        return 'bi bi-x-circle-fill text-red-400';
      case 'warning':
        return 'bi bi-exclamation-triangle-fill text-yellow-400';
      case 'info':
        return 'bi bi-info-circle-fill text-blue-400';
      case 'question':
        return 'bi bi-question-circle-fill text-purple-400';
      default:
        return 'bi bi-info-circle-fill text-blue-400';
    }
  }

  ngOnInit() {
    if (this.autoClose) {
      setTimeout(() => this.close(), 4000);
    }
  }

  close() {
    this.closed.emit();
  }
}
