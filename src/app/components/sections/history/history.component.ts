import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguageService } from '@/app/services/language.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
  languageService = inject(LanguageService);
  expanded: boolean = false; // controla si está expandido
  isLargeScreen: boolean = false;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 1280; // xl breakpoint
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}
