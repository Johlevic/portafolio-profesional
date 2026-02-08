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
  projectLink: string;
}

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-blue-500/50 rounded-xl p-6 shadow-lg text-center w-full h-full flex flex-col transition-all duration-300 hover:shadow-xl dark:hover:shadow-blue-500/20 group"
    >
      <div
        class="relative overflow-hidden rounded-md mb-4 h-48 md:h-60 flex items-center justify-center bg-gray-50 dark:bg-gray-700"
      >
        <img
          [src]="imagePath"
          [alt]="languageService.t(project.title)"
          class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          (error)="onImageError($event)"
        />
      </div>

      <h3
        class="text-gray-800 dark:text-blue-400 text-lg md:text-xl font-bold mb-2 truncate overflow-hidden transition-colors duration-300"
      >
        {{ languageService.t(project.title) }}
      </h3>

      <div class="flex flex-wrap justify-center gap-2 mb-4">
        @for (tech of project.technologies; track tech.name) {
          <span
            class="bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-xs px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1 transition-colors duration-300"
          >
            @if (tech.icon) {
              <i [class]="tech.icon"></i>
            }
            {{ tech.name }}
          </span>
        }
      </div>

      <div class="mt-auto flex justify-center gap-4">
        <a
          [href]="project.repoLink"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white py-2 px-4 rounded-lg transition duration-300 text-sm font-medium border border-gray-200 dark:border-transparent"
          [attr.aria-label]="
            languageService.t('projects.repo') +
            ' ' +
            languageService.t(project.title)
          "
        >
          <i class="bi bi-github"></i>
          {{ languageService.t('projects.repo') }}
        </a>
        <a
          [href]="project.projectLink"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300 text-sm"
          [attr.aria-label]="
            languageService.t('projects.live') +
            ': ' +
            languageService.t(project.title)
          "
        >
          <i class="bi bi-arrow-up-right"></i>
          {{ languageService.t('projects.live') }}
        </a>
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

  get imagePath(): string {
    return this.project.image || 'assets/img/projects/portafolio.png';
  }

  onImageError(event: any) {
    event.target.src = 'assets/img/projects/portafolio.png';
  }
}
