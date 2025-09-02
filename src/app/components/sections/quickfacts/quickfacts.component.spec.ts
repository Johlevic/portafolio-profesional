import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickfactsComponent } from './quickfacts.component';

describe('QuickfactsComponent', () => {
  let component: QuickfactsComponent;
  let fixture: ComponentFixture<QuickfactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickfactsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuickfactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
