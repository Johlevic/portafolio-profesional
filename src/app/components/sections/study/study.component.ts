import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

type SectionKey = 'education' | 'certifications';

import { LanguageService } from '@/app/services/language.service';
import { BottomSheetService } from '@/app/services/bottom-sheet.service';

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss'],
})
export class StudyComponent implements OnInit {
  languageService = inject(LanguageService);
  bottomSheetService = inject(BottomSheetService);

  // viewport
  isMobile = false;

  ngOnInit() {
    this.updateViewportState();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateViewportState();
  }

  private updateViewportState() {
    this.isMobile = window.innerWidth < 1280; // xl breakpoint
  }

  openEducationSheet() {
    this.bottomSheetService.open({
      title: this.languageService.t('study.title'),
      icon: 'bi-mortarboard',
      type: 'list',
      items: [
        {
          label: this.languageService.t('study.education.title'),
          value: `${this.languageService.t('study.education.institution')} (2022 - 2024)`,
          icon: 'bi-bank',
        },
        {
          label: this.languageService.t('study.certifications.title'),
          value: 'Spring Boot, Google Data Analytics, Google Cybersecurity',
          icon: 'bi-patch-check',
        },
      ],
    });
  }

  openStatsSheet() {
    this.bottomSheetService.open({
      title: this.languageService.t('study.stats.title'),
      icon: 'bi-lightning-charge',
      type: 'list',
      items: [
        {
          label: this.languageService.t('study.stats.experience'),
          value: this.languageService.t('study.stats.years'),
          icon: 'bi-briefcase',
        },
        {
          label: this.languageService.t('study.stats.projects'),
          value: this.languageService.t('study.stats.projectsCount'),
          icon: 'bi-code-square',
        },
        {
          label: this.languageService.t('study.stats.clients'),
          value: this.languageService.t('study.stats.clientsCount'),
          icon: 'bi-people',
        },
        {
          label: this.languageService.t('study.stats.location'),
          value: this.languageService.t('study.stats.city'),
          icon: 'bi-geo-alt',
        },
      ],
    });
  }
}
