import { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ProjectsComponent } from './components/sections/projects/projects.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' } // redirige si no encuentra ruta
];
