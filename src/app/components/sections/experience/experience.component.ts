import {
  Component,
  inject,
  OnInit,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,
  PLATFORM_ID,
  HostListener,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Experience } from '../../../models/experience';
import { LanguageService } from '@/app/services/language.service';
import { HeaderPortalService } from '@/app/services/header-portal.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('timelineItem') timelineItems!: QueryList<ElementRef>;

  @ViewChild('headerRef') headerRef!: ElementRef;
  @ViewChild('stickyTitleTemplate') stickyTitleTemplate!: TemplateRef<any>;

  languageService = inject(LanguageService);
  private headerPortalService = inject(HeaderPortalService);
  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  tracingHeight = 0;
  private isStickyVisible = false;
  isDesktop = false;

  experiences: Experience[] = [
    {
      company: 'experience.jobs.blanc.company',
      location: 'experience.jobs.blanc.location',
      role: 'experience.jobs.blanc.role',
      duration: 'experience.jobs.blanc.duration',
      type: 'contrato',
      responsibilities: [
        'experience.jobs.blanc.responsibilities.r1',
        'experience.jobs.blanc.responsibilities.r2',
      ],
      icon: 'fas fa-briefcase', // Ejemplo de clase para ícono
    },
    {
      company: 'experience.jobs.ditech.company',
      location: 'experience.jobs.ditech.location',
      role: 'experience.jobs.ditech.role',
      duration: 'experience.jobs.ditech.duration',
      type: 'presencial',
      responsibilities: [
        'experience.jobs.ditech.responsibilities.r1',
        'experience.jobs.ditech.responsibilities.r2',
        'experience.jobs.ditech.responsibilities.r3',
        'experience.jobs.ditech.responsibilities.r4',
      ],
      icon: 'fas fa-laptop-code',
    },
    {
      company: 'experience.jobs.continental.company',
      location: 'experience.jobs.continental.location',
      role: 'experience.jobs.continental.role',
      duration: 'experience.jobs.continental.duration',
      type: 'presencial',
      responsibilities: [
        'experience.jobs.continental.responsibilities.r1',
        'experience.jobs.continental.responsibilities.r2',
        'experience.jobs.continental.responsibilities.r3',
      ],
      icon: 'fas fa-wrench',
    },
  ].map((exp) => ({ ...exp, isVisible: false }));

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDesktop = window.innerWidth >= 768; // Consistent with md:hidden in template
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDesktop = window.innerWidth >= 768;
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Pequeno delay para asegurar que el DOM este listo
      setTimeout(() => {
        this.setupIntersectionObserver();
      }, 100);
    }
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2, // Trigger when 20% of the item is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = (entry.target as HTMLElement).dataset['index'];
          if (index !== undefined && this.experiences[+index]) {
            this.experiences[+index].isVisible = true;
            this.updateTracingHeight();
            observer.unobserve(entry.target); // Dejar de observar una vez que es visible
          }
        }
      });
    }, options);

    this.timelineItems.forEach((item) => observer.observe(item.nativeElement));
  }

  private updateTracingHeight() {
    const visibleCount = this.experiences.filter((exp) => exp.isVisible).length;
    this.tracingHeight = (visibleCount / this.experiences.length) * 100;
  }

  toggleExpand(exp: Experience) {
    exp.isExpanded = !exp.isExpanded;
  }

  ngOnDestroy() {
    this.headerPortalService.clearPortalContent();
  }

  @HostListener('window:scroll')
  onScroll() {
    if (!isPlatformBrowser(this.platformId) || !this.headerRef) return;

    const headerRect = this.headerRef.nativeElement.getBoundingClientRect();
    const componentRect = this.elementRef.nativeElement.getBoundingClientRect();
    const headerBottomThreshold = 80;

    // Show when header is scrolled out AND component is still visible
    if (
      headerRect.bottom < headerBottomThreshold &&
      componentRect.bottom > headerBottomThreshold
    ) {
      if (!this.isStickyVisible) {
        this.headerPortalService.setPortalContent(this.stickyTitleTemplate);
        this.isStickyVisible = true;
      }
    } else {
      if (this.isStickyVisible) {
        this.headerPortalService.clearPortalContent();
        this.isStickyVisible = false;
      }
    }
  }
}
