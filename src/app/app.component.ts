import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from "./components/header/header.component";
import { ContactComponent } from "./components/contact/contact.component";
import { FooterComponent } from "./components/footer/footer.component";
import { ExperienceComponent } from "./components/sections/experience/experience.component";
import { ProjectsComponent } from "./components/sections/projects/projects.component";
import { TechnicalskilsComponent } from "./components/sections/technicalskils/technicalskils.component";
import { HistoryComponent } from "./components/sections/history/history.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ContactComponent, FooterComponent, ExperienceComponent, ProjectsComponent, TechnicalskilsComponent, HistoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-portafolio';
}
