import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderPortalService {
  private portalContentSubject = new BehaviorSubject<TemplateRef<any> | null>(
    null,
  );
  portalContent$ = this.portalContentSubject.asObservable();

  setPortalContent(content: TemplateRef<any> | null) {
    this.portalContentSubject.next(content);
  }

  clearPortalContent() {
    this.portalContentSubject.next(null);
  }
}
