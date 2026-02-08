import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SkillCategory } from '../models/skill';

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService {
  private activeCategorySubject = new BehaviorSubject<SkillCategory | null>(
    null,
  );
  activeCategory$ = this.activeCategorySubject.asObservable();

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  open(category: SkillCategory) {
    this.activeCategorySubject.next(category);
    this.isOpenSubject.next(true);
    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.isOpenSubject.next(false);
    document.body.classList.remove('overflow-hidden');
    // Delay clearing the category to allow animation to finish
    setTimeout(() => {
      this.activeCategorySubject.next(null);
    }, 500);
  }
}
