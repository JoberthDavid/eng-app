import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../../core/auth/auth.service';
import { CompositionNavigationService } from '../../services/composition-navigation.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  const authServiceMock = {
    currentUser$: of(null),
    logout: jasmine.createSpy('logout').and.returnValue(of({})),
    clearSession: jasmine.createSpy('clearSession')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authServiceMock
        },
        CompositionNavigationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});