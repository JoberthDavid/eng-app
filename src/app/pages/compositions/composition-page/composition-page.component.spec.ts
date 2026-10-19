import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompositionPageComponent } from './composition-page.component';
import { ProjectService } from '../../../services/project.service';
import { CompositionService } from '../../../core/integrations/composition/composition.service';
import { CompositionTreeService } from '../../../services/composition-tree.service';
import { CompositionNavigationService } from '../../../services/composition-navigation.service';

describe('CompositionPageComponent', () => {
  let component: CompositionPageComponent;
  let fixture: ComponentFixture<CompositionPageComponent>;

  const projectServiceMock = {
    getBudgetById: jasmine.createSpy('getBudgetById').and.returnValue(null),
    getById: jasmine.createSpy('getById').and.returnValue(null),
    getCompositionByBudget: jasmine.createSpy('getCompositionByBudget').and.returnValue(null)
  };

  const compositionServiceMock = {
    calculateDetail: jasmine.createSpy('calculateDetail').and.returnValue(of(null))
  };

  const compositionTreeServiceMock = {
    buildTreeFromReferences: jasmine.createSpy('buildTreeFromReferences').and.returnValue(null)
  };

  const compositionNavigationServiceMock = {
    selectedNode: () => null,
    setActiveTree: jasmine.createSpy('setActiveTree'),
    clear: jasmine.createSpy('clear')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompositionPageComponent],
      providers: [
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
        },
        {
          provide: CompositionTreeService,
          useValue: compositionTreeServiceMock
        },
        {
          provide: CompositionNavigationService,
          useValue: compositionNavigationServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompositionPageComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});