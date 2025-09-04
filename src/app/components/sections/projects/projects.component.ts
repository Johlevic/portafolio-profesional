import { Component } from '@angular/core';
import { SliderComponent } from "../../reusable/slider/slider.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [SliderComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {

  projects = [
    {
      title: 'E-commerce Web',
      image: 'assets/projects/ecommerce.png',
      technologies: [
        { name: 'Angular', icon: 'fab fa-angular' },
        { name: 'Firebase', icon: 'fas fa-fire' },
        { name: 'Bootstrap', icon: 'fab fa-bootstrap' }
      ],
      demo: 'https://mi-ecommerce-demo.com',
      github: 'https://github.com/miusuario/ecommerce'
    },
    {
      title: 'Blog Personal',
      image: 'assets/projects/blog.png',
      technologies: [
        { name: 'React', icon: 'fab fa-react' },
        { name: 'Node.js', icon: 'fab fa-node' }
      ],
      demo: 'https://mi-blog.com',
      github: 'https://github.com/miusuario/blog'
    }
  ];



}
