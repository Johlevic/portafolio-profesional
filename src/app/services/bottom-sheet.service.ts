import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface BottomSheetItem {
  label?: string;
  value?: string;
  icon?: string;
  level?: number;
  link?: string;
  isExternal?: boolean;
}

export interface BottomSheetContent {
  title: string;
  icon: string;
  type: 'skills' | 'list' | 'social' | 'article';
  items: BottomSheetItem[];
  highlightIndex?: number; // Index of the item to highlight (e.g., to continue reading)
}

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService {
  private contentSubject = new BehaviorSubject<BottomSheetContent | null>(null);
  content$ = this.contentSubject.asObservable();

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  open(content: BottomSheetContent) {
    this.contentSubject.next(content);
    this.isOpenSubject.next(true);
    document.body.classList.add('overflow-hidden');
  }

  getContent(): BottomSheetContent | null {
    return this.contentSubject.value;
  }

  close() {
    this.isOpenSubject.next(false);
    document.body.classList.remove('overflow-hidden');
    // Delay clearing content to allow animation to finish
    setTimeout(() => {
      if (!this.isOpenSubject.value) {
        this.contentSubject.next(null);
      }
    }, 500);
  }
}
