import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { HttpErrorPageComponent } from './http-error-page.component';
import { LanguageService } from '@/app/services/language.service';

describe('HttpErrorPageComponent', () => {
  let component: HttpErrorPageComponent;
  let fixture: ComponentFixture<HttpErrorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpErrorPageComponent],
      providers: [
        LanguageService,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ code: '404' })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HttpErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should normalize status 404 from route', () => {
    expect(component.status()).toBe(404);
  });
});
