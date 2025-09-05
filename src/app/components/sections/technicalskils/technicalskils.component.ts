// technicalskils.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillCategory } from '../../../models/skill';
import { AnimateOnDisplayDirective } from '../../../animate-on-display.directive';
@Component({
  selector: 'app-technicalskils',
  standalone: true,
  imports: [CommonModule, AnimateOnDisplayDirective],
  templateUrl: './technicalskils.component.html',
  styleUrl: './technicalskils.component.scss'
})
export class TechnicalskilsComponent {
  skills: SkillCategory[] = [
    {
      title: 'Frontend',
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
        { name: 'SCSS', level: 90 }
      ],
      isCollapsed: true // Estado inicial: colapsado
    },
    {
      title: 'Backend',
      icon: 'bi bi-server',
      skills: [
        { name: 'Laravel', level: 90 },
        { name: 'Spring Boot', level: 65 },
        { name: 'Node.js', level: 75 },
        { name: 'Python', level: 80 },
        { name: 'Java', level: 60 },
        { name: 'PHP', level: 80 },
        { name: 'Django', level: 70 },
        { name: 'REST APIs', level: 90 }
      ],
      isCollapsed: true // Estado inicial: colapsado
    },
    {
      title: 'Base de Datos',
      icon: 'bi bi-database',
      skills: [
        { name: 'MySQL', level: 85 },
        { name: 'PostgreSQL', level: 80 },
        { name: 'Firebase', level: 75 },
        { name: 'SQL', level: 90 }
      ],
      isCollapsed: true // Estado inicial: colapsado
    },
    {
      title: 'DevOps & Cloud',
      icon: 'bi bi-cloud',
      skills: [
        { name: 'Azure', level: 65 },
        { name: 'AWS', level: 60 },
        { name: 'Docker', level: 70 },
        { name: 'Git', level: 95 }
      ],
      isCollapsed: true // Estado inicial: colapsado
    },
    {
      title: 'Mobile',
      icon: 'bi bi-phone',
      skills: [
        { name: 'Flutter', level: 75 },
        { name: 'Android', level: 60 },
        { name: 'Xamarin', level: 55 }
      ],
      isCollapsed: true // Estado inicial: colapsado
    },
    {
      title: 'IA y RA',
      icon: 'bi bi-robot',
      skills: [
        { name: 'Machine Learning', level: 60 },
        { name: 'Robótica (Arduino)', level: 70 },
        { name: 'Unity 3D', level: 65 }
      ],
      isCollapsed: true // Estado inicial: colapsado
    },
    {
      title: 'Analista de Datos',
      icon: 'bi bi-bar-chart',
      skills: [
        { name: 'Excel', level: 90 },
        { name: 'Tableau', level: 65 },
        { name: 'R RStudio', level: 60 }
      ],
      isCollapsed: true // Estado inicial: colapsado
    }
  ];

  toggleCollapse(category: SkillCategory): void {
    category.isCollapsed = !category.isCollapsed;
  }
}
