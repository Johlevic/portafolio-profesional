// experience.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience } from '../../../models/experience';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent {
  experiences: Experience[] = [
    {
      company: 'BLANC LABS',
      location: 'Remoto, Trujillo, Perú',
      role: 'Associate (Contrato de formación)',
      duration: 'Oct. 2024 – Actualidad',
      type: 'contrato',
      responsibilities: [
        'Participación en sesiones de conocimiento y grupos de aprendizaje multidisciplinarios orientados a la transformación digital en los sectores financiero y de salud.',
        'Exploración de desafíos de transformación digital y análisis de cómo la tecnología puede ofrecer soluciones prácticas.'
      ],
      icon: 'fas fa-briefcase' // Ejemplo de clase para ícono
    },
    {
      company: 'DITECH PERU',
      location: 'Trujillo, Perú',
      role: 'Desarrollador Web',
      duration: 'Enero 2025 – Actualidad',
      type: 'presencial',
      responsibilities: [
        'Desarrollo de aplicaciones web usando Laravel, Angular, Java y React.',
        'Implementación de sistemas de gestión de productos y módulos internos.',
        'Integración de bases de datos y servicios backend para asegurar eficiencia y seguridad.',
        'Colaboración en proyectos web completos, desde planificación hasta despliegue.'
      ],
      icon: 'fas fa-laptop-code'
    },
    {
      company: 'Distribuciones Continental',
      location: 'Trujillo, Perú',
      role: 'Asistente Informático',
      duration: 'Enero 2025 – Junio 2025',
      type: 'presencial',
      responsibilities: [
        'Mantenimiento y soporte técnico de equipos informáticos.',
        'Gestión y administración de la red local.',
        'Resolución de problemas de software y hardware.'
      ],
      icon: 'fas fa-wrench'
    }
  ];

  toggleExpand(exp: Experience) {
    exp.isExpanded = !exp.isExpanded;
  }
}
