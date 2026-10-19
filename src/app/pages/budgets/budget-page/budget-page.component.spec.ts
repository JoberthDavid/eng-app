import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { BudgetPageComponent } from './budget-page.component';
import { ProjectService } from '../../../services/project.service';
import { CompositionService } from '../../../core/integrations/composition/composition.service';

describe('BudgetPageComponent', () => {
  let component: BudgetPageComponent;
  let fixture: ComponentFixture<BudgetPageComponent>;

  const projectServiceMock = {
    getBudgetById: jasmine.createSpy('getBudgetById').and.returnValue(null),
    getById: jasmine.createSpy('getById').and.returnValue(null),
    getCompositions: jasmine.createSpy('getCompositions').and.returnValue([])
  };

  const compositionServiceMock = {
    calculate: jasmine.createSpy('calculate'),
    calculateDetail: jasmine.createSpy('calculateDetail')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        },
        {
          provide: ProjectService,
          useValue: projectServiceMock
        },
        {
          provide: CompositionService,
          useValue: compositionServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetPageComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});