import { Component, HostListener, OnInit, inject } from '@angular/core';
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
export class HistoryComponent implements OnInit {
  languageService = inject(LanguageService);
  private bottomSheetService = inject(BottomSheetService);
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
        highlightIndex: 2, // Highlights starting from p3
      });
      return;
    }
    this.expanded = !this.expanded;
  }
}
