import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  /**
   * ISO `YYYY-MM-DD` — referencia para ordenar “más recientes / más antiguos”.
   * Actualiza la fecha al publicar o destacar el proyecto.
   */
  addedAt?: string;
}

/** Máximo de chips en tarjeta (rejilla 3×3). */
const TECH_GRID_MAX = 9;

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
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

      <div class="mb-0 self-stretch pt-2.5 md:pt-3 pb-3 md:pb-4 min-h-[6.5rem] md:min-h-[7.25rem]">
        <div
          class="grid grid-cols-3 gap-1.5 md:gap-2 auto-rows-fr content-start"
          role="list"
        >
          @for (tech of displayTechnologies; track tech.name) {
            <span
              role="listitem"
              class="min-w-0 bg-blue-50/90 dark:bg-blue-600/15 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-500/25 text-[10px] md:text-[11px] px-1.5 md:px-2 py-1 rounded-lg flex flex-col items-center justify-center gap-0.5 text-center leading-tight transition-colors duration-200 hover:border-blue-300 dark:hover:border-blue-400/40"
            >
              @if (tech.icon) {
                <i [class]="tech.icon + ' text-[0.95em] shrink-0'"></i>
              }
              <span class="line-clamp-2 break-words hyphens-auto">{{
                tech.name
              }}</span>
            </span>
          }
        </div>
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
export class ProjectCardComponent {
  languageService = inject(LanguageService);
  @Input({ required: true }) project!: Project;

  /** Hasta 9 tecnologías (orden definido en cada proyecto). */
  get displayTechnologies(): Technology[] {
    const list = this.project.technologies ?? [];
    return list.slice(0, TECH_GRID_MAX);
  }

  get projectLinkLabel(): string {
    return this.languageService.t(
      this.project.projectLinkLabelKey ?? 'projects.live',
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
