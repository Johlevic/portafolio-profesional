import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutSectionComponent } from './components/sections/about-section/about-section.component';
import { TechnicalskilsComponent } from './components/sections/technicalskils/technicalskils.component';
import { ProjectsComponent } from './components/sections/projects/projects.component';
import { ExperienceComponent } from './components/sections/experience/experience.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { titleKey: 'nav.home' } },
  {
    path: 'sobre-mi',
    component: AboutSectionComponent,
    data: { titleKey: 'nav.about' },
  },
  {
    path: 'habilidades',
    component: TechnicalskilsComponent,
    data: { titleKey: 'nav.skills' },
  },
  {
    path: 'proyectos',
    component: ProjectsComponent,
    data: { titleKey: 'nav.projects' },
  },
  {
    path: 'experiencia',
    component: ExperienceComponent,
    data: { titleKey: 'nav.experience' },
  },
  {
    path: 'contacto',
    component: ContactComponent,
    data: { titleKey: 'nav.contact' },
  },
  { path: '**', redirectTo: '' },
];
