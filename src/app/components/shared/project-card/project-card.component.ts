import { Component, Input, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { LanguageService } from '@/app/services/language.service';

export interface Technology {
  name: string;
  icon?: string;
}

export interface Project {
  title: string;
  image: string;
  technologies: Technology[];
  repoLink: string;
  /** Live site or download URL. Omit when repoOnly is true. */
  projectLink?: string;
  /** i18n key for the secondary link label (default: projects.live) */
  projectLinkLabelKey?: string;
  /** Backend / repo-only: shows only the repository button */
  repoOnly?: boolean;
}

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('techExtraExpand', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px)' }),
        animate(
          '340ms cubic-bezier(0.33, 1, 0.68, 1)',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '260ms cubic-bezier(0.4, 0, 1, 1)',
          style({ opacity: 0, transform: 'translateY(-6px)' }),
        ),
      ]),
    ]),
  ],
  template: `
    <div
      class="relative overflow-hidden bg-white dark:bg-gray-800/90 border border-gray-200/90 dark:border-slate-600/60 rounded-2xl p-4 md:p-6 shadow-md shadow-gray-200/50 dark:shadow-none text-center w-full h-full flex flex-col transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-300/40 dark:hover:border-blue-500/45 dark:hover:shadow-lg dark:hover:shadow-blue-950/40 group"
    >
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      ></div>

      <div
        class="relative overflow-hidden rounded-xl mb-3 md:mb-4 h-48 md:h-60 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 ring-1 ring-inset ring-black/[0.04] dark:ring-white/[0.06] transition-[box-shadow] duration-300 group-hover:ring-blue-500/25 dark:group-hover:ring-blue-400/20"
      >
        <img
          [src]="imagePath"
          [alt]="languageService.t(project.title)"
          class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          loading="lazy"
          (error)="onImageError($event)"
        />
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-black/40"
          aria-hidden="true"
        ></div>
      </div>

      <h3
        class="text-gray-800 dark:text-blue-300 text-sm md:text-[0.95rem] font-semibold leading-snug pb-2.5 md:pb-3 text-balance break-words transition-colors duration-300 border-b border-gray-100 dark:border-slate-600/50 group-hover:text-blue-700 dark:group-hover:text-blue-200"
      >
        {{ languageService.t(project.title) }}
      </h3>

      <div class="mb-0 self-stretch pt-2.5 md:pt-3 pb-3 md:pb-4">
        <div
          class="flex flex-wrap justify-center gap-1.5 md:gap-2 min-h-[4.75rem] content-start"
        >
          @for (tech of previewTechnologies; track tech.name) {
            <span
              class="bg-blue-50/90 dark:bg-blue-600/15 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-500/25 text-[11px] md:text-xs px-2 md:px-2.5 py-0.5 md:py-1 rounded-full whitespace-nowrap inline-flex items-center gap-1 transition-colors duration-200 hover:border-blue-300 dark:hover:border-blue-400/40"
            >
              @if (tech.icon) {
                <i [class]="tech.icon"></i>
              }
              {{ tech.name }}
            </span>
          }
        </div>
        @if (techExpanded && extraTechnologies.length > 0) {
          <div
            @techExtraExpand
            class="flex flex-wrap justify-center gap-2 mt-2"
          >
            @for (tech of extraTechnologies; track tech.name) {
              <span
                class="bg-blue-50/90 dark:bg-blue-600/15 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-500/25 text-[11px] md:text-xs px-2 md:px-2.5 py-0.5 md:py-1 rounded-full whitespace-nowrap inline-flex items-center gap-1 transition-colors duration-200 hover:border-blue-300 dark:hover:border-blue-400/40"
              >
                @if (tech.icon) {
                  <i [class]="tech.icon"></i>
                }
                {{ tech.name }}
              </span>
            }
          </div>
        }
        @if (extraTechnologies.length > 0) {
          <button
            type="button"
            class="mt-1.5 w-full text-center text-[11px] md:text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded py-0.5 transition-colors duration-200"
            (click)="toggleTechExpanded($event)"
            [attr.aria-expanded]="techExpanded"
          >
            @if (techExpanded) {
              {{ languageService.t('projects.viewLess') }}
            } @else {
              +{{ extraTechnologies.length }}
              {{ languageService.t('projects.techMore') }}
            }
          </button>
        }
      </div>

      <div
        class="mt-auto flex justify-center gap-2.5 md:gap-3 flex-wrap border-t border-gray-100 dark:border-slate-600/50 pt-3 md:pt-4"
      >
        <a
          [href]="project.repoLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-100 text-gray-800 dark:bg-slate-700/80 dark:hover:bg-slate-600 dark:text-slate-100 py-2 px-3.5 md:px-4 rounded-xl transition duration-200 text-xs md:text-sm font-medium border border-gray-200/90 dark:border-slate-600/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
          [attr.aria-label]="
            languageService.t('projects.repo') +
            ' ' +
            languageService.t(project.title)
          "
        >
          <i class="bi bi-github text-[1.05em]"></i>
          {{ languageService.t('projects.repo') }}
        </a>
        @if (!project.repoOnly && project.projectLink) {
          <a
            [href]="project.projectLink"
            [attr.target]="projectLinkTarget"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white py-2 px-3.5 md:px-4 rounded-xl transition duration-200 text-xs md:text-sm font-medium shadow-sm shadow-blue-600/25 hover:shadow-md hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
            [attr.aria-label]="
              projectLinkLabel + ': ' + languageService.t(project.title)
            "
          >
            <i
              class="bi"
              [class.bi-download]="isDirectDownload"
              [class.bi-arrow-up-right]="!isDirectDownload"
            ></i>
            {{ projectLinkLabel }}
          </a>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class ProjectCardComponent implements OnChanges {
  languageService = inject(LanguageService);
  @Input({ required: true }) project!: Project;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project']) {
      this.techExpanded = false;
    }
  }

  /** Chips visibles antes de expandir (~2 filas alineadas entre tarjetas). */
  private readonly techPreviewLimit = 6;
  techExpanded = false;

  /** Primeras tecnologías (siempre visibles; jerarquía por orden en el array). */
  get previewTechnologies(): Technology[] {
    const list = this.project.technologies ?? [];
    return list.slice(0, Math.min(this.techPreviewLimit, list.length));
  }

  /** Resto de tecnologías; se muestran con animación al expandir. */
  get extraTechnologies(): Technology[] {
    const list = this.project.technologies ?? [];
    if (list.length <= this.techPreviewLimit) {
      return [];
    }
    return list.slice(this.techPreviewLimit);
  }

  toggleTechExpanded(ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.techExpanded = !this.techExpanded;
  }

  get projectLinkLabel(): string {
    return this.languageService.t(
      this.project.projectLinkLabelKey ?? 'projects.live'
    );
  }

  get isDirectDownload(): boolean {
    return (
      !this.project.repoOnly &&
      this.project.projectLinkLabelKey === 'projects.downloadDirect'
    );
  }

  /** Same-window navigation for installers; new tab for normal URLs */
  get projectLinkTarget(): '_blank' | null {
    return this.isDirectDownload ? null : '_blank';
  }

  get imagePath(): string {
    return this.project.image || 'assets/img/projects/pantallas-led.png';
  }

  onImageError(event: any) {
    event.target.src = 'assets/img/projects/pantallas-led.png';
  }
}
