import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type SectionKey = 'education' | 'certifications';

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss'],
})
export class StudyComponent implements OnInit {
  // estado de cada article
  expanded: Record<SectionKey, boolean> = {
    education: false,
    certifications: false,
  };

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
    this.isMobile = window.innerWidth < 768;

    if (this.isMobile) {
      // En móvil: cerrados por defecto
      this.expanded.education = false;
      this.expanded.certifications = false;
    } else {
      // En tablet+ forzamos abierto (sin colapso)
      this.expanded.education = true;
      this.expanded.certifications = true;
    }
  }

  toggleArticle(section: SectionKey) {
    if (!this.isMobile) return; // solo móvil colapsa
    this.expanded[section] = !this.expanded[section];
  }

  // clase del ícono para el botón (solo móvil)
  getIcon(section: SectionKey): string {
    return this.expanded[section] ? 'bi bi-chevron-up' : 'bi bi-chevron-down';
  }
}
