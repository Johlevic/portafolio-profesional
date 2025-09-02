import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalskilsComponent } from './technicalskils.component';

describe('TechnicalskilsComponent', () => {
  let component: TechnicalskilsComponent;
  let fixture: ComponentFixture<TechnicalskilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalskilsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnicalskilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
