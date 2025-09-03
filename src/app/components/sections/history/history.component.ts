import { Component } from '@angular/core';
import { StudyComponent } from "../study/study.component";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [StudyComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {

}
