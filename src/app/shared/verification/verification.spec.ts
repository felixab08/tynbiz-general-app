import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Verification } from './verification';
import { VerificationService } from '@app/services/general/verification.service';
import { AuthService } from '@app/auth/services/auth.service';
import { MenuService } from '@app/auth/services/menu.service';

describe('Verification', () => {
  let component: Verification;
  let fixture: ComponentFixture<Verification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Verification],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => 'test-token',
              },
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
        {
          provide: AuthService,
          useValue: {
            handleAuthSuccess: jasmine.createSpy('handleAuthSuccess'),
          },
        },
        {
          provide: MenuService,
          useValue: {
            redirectLinkForRole: () => '/home',
          },
        },
        {
          provide: VerificationService,
          useValue: {
            postPlanes: () =>
              of({
                user: {
                  firstName: 'Ana',
                  lastName: 'Pérez',
                  fullName: 'Ana Pérez',
                },
                accessToken: 'abc123',
              }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Verification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render a welcome card with the user name', () => {
    expect(fixture.nativeElement.textContent).toContain('Bienvenido a Tynbiz');
    expect(fixture.nativeElement.textContent).toContain('Ana');
  });
});
