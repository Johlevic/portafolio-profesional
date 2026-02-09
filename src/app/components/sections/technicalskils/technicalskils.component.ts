import {
  Component,
  inject,
  Renderer2,
  HostListener,
  PLATFORM_ID,
  Inject,
  ViewChild,
  TemplateRef,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SkillCategory } from '../../../models/skill';
import { AnimateOnDisplayDirective } from '../../../animate-on-display.directive';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';
import { LanguageService } from '@/app/services/language.service';
import { BottomSheetService } from '@/app/services/bottom-sheet.service';
import { HeaderPortalService } from '@/app/services/header-portal.service';

@Component({
  selector: 'app-technicalskils',
  standalone: true,
  imports: [CommonModule, AnimateOnDisplayDirective, ScrollRevealDirective],
  templateUrl: './technicalskils.component.html',
  styleUrl: './technicalskils.component.scss',
})
export class TechnicalskilsComponent implements OnDestroy {
  languageService = inject(LanguageService);
  private bottomSheetService = inject(BottomSheetService);
  private headerPortalService = inject(HeaderPortalService);
  private el = inject(ElementRef);

  @ViewChild('stickyTabsTemplate') stickyTabsTemplate!: TemplateRef<any>;
  @ViewChild('tabsContainer') tabsContainer!: ElementRef;

  // Tab management for desktop
  selectedTab: number = 0;
  isDesktop: boolean = false;
  private isStickyVisible = false;

  skills: SkillCategory[] = [
    {
      title: 'skills.frontend',
      icon: 'bi bi-code-slash',
      skills: [
        { name: 'React', level: 90 },
        { name: 'Angular', level: 85 },
        { name: 'TypeScript', level: 95 },
        { name: 'JavaScript', level: 90 },
        { name: 'HTML5', level: 98 },
        { name: 'CSS3', level: 95 },
        { name: 'Tailwind CSS', level: 80 },
        { name: 'Bootstrap', level: 85 },
        { name: 'SCSS', level: 90 },
      ],
      isCollapsed: true, // Estado inicial: colapsado
    },
    {
      title: 'skills.backend',
      icon: 'bi bi-server',
      skills: [
        { name: 'Laravel', level: 90 },
        { name: 'Spring Boot', level: 65 },
        { name: 'Node.js', level: 75 },
        { name: 'Python', level: 80 },
        { name: 'Java', level: 60 },
        { name: 'PHP', level: 80 },
        { name: 'Django', level: 70 },
        { name: 'REST APIs', level: 90 },
      ],
      isCollapsed: true, // Estado inicial: colapsado
    },
    {
      title: 'skills.database',
      icon: 'bi bi-database',
      skills: [
        { name: 'MySQL', level: 85 },
        { name: 'PostgreSQL', level: 80 },
        { name: 'Firebase', level: 75 },
        { name: 'SQL', level: 90 },
      ],
      isCollapsed: true, // Estado inicial: colapsado
    },
    {
      title: 'skills.devops',
      icon: 'bi bi-cloud',
      skills: [
        { name: 'Azure', level: 65 },
        { name: 'AWS', level: 60 },
        { name: 'Docker', level: 70 },
        { name: 'Git', level: 95 },
      ],
      isCollapsed: true, // Estado inicial: colapsado
    },
    {
      title: 'skills.mobile',
      icon: 'bi bi-phone',
      skills: [
        { name: 'Flutter', level: 75 },
        { name: 'Android', level: 60 },
        { name: 'Xamarin', level: 55 },
      ],
      isCollapsed: true, // Estado inicial: colapsado
    },
    {
      title: 'skills.ai',
      icon: 'bi bi-robot',
      skills: [
        { name: 'Machine Learning', level: 60 },
        { name: 'Robótica (Arduino)', level: 70 },
        { name: 'Unity 3D', level: 65 },
      ],
      isCollapsed: true, // Estado inicial: colapsado
    },
    {
      title: 'skills.data_analyst',
      icon: 'bi bi-bar-chart',
      skills: [
        { name: 'Excel', level: 90 },
        { name: 'Tableau', level: 65 },
        { name: 'R RStudio', level: 60 },
      ],
      isCollapsed: true, // Estado inicial: colapsado
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.checkBreakpoint();
  }

  @HostListener('window:scroll')
  onScroll() {
    if (!this.isDesktop || !isPlatformBrowser(this.platformId)) return;

    // Safety check if tabsContainer is available
    if (!this.tabsContainer) return;

    const tabsRect = this.tabsContainer.nativeElement.getBoundingClientRect();

    // Fix: If the element is hidden (e.g. on Home page desktop where it's md:hidden),
    // dimensions will be 0. We shouldn't trigger sticky tabs in this case.
    if (tabsRect.height === 0 || tabsRect.width === 0) {
      if (this.isStickyVisible) {
        this.headerPortalService.clearPortalContent();
        this.isStickyVisible = false;
      }
      return;
    }

    const componentRect = this.el.nativeElement.getBoundingClientRect();
    const headerBottomThreshold = 100; // Height of the header + some buffer

    // Show sticky tabs ONLY when:
    // 1. The main tabs have scrolled completely past the header (tabsRect.bottom < threshold)
    // 2. The component is STILL in view (componentRect.bottom > threshold) - prevents staying visible in next sections
    if (
      tabsRect.bottom < headerBottomThreshold &&
      componentRect.bottom > headerBottomThreshold
    ) {
      if (!this.isStickyVisible) {
        this.headerPortalService.setPortalContent(this.stickyTabsTemplate);
        this.isStickyVisible = true;
      }
    } else {
      if (this.isStickyVisible) {
        this.headerPortalService.clearPortalContent();
        this.isStickyVisible = false;
      }
    }
  }

  ngOnDestroy() {
    this.headerPortalService.clearPortalContent();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkBreakpoint();
  }

  private checkBreakpoint() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDesktop = window.innerWidth >= 1024;
      if (!this.isDesktop) {
        this.headerPortalService.clearPortalContent();
        this.isStickyVisible = false;
      }
    }
  }

  selectTab(index: number): void {
    this.selectedTab = index;
  }

  toggleCollapse(category: SkillCategory): void {
    category.isCollapsed = !category.isCollapsed;
  }

  openBottomSheet(category: SkillCategory): void {
    this.bottomSheetService.open({
      title: this.languageService.t(category.title),
      icon: category.icon,
      type: 'skills',
      items: category.skills.map((s) => ({
        label: s.name,
        level: s.level,
      })),
    });
  }
}
