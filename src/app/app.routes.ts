import { Routes } from '@angular/router';

import { ProjectsPageComponent }
  from './pages/projects/projects-page/projects-page.component';

import { ProjectPageComponent }
  from './pages/projects/project-page/project-page.component';

import { BudgetsPageComponent }
  from './pages/budgets/budgets-page/budgets-page.component';

import { BudgetPageComponent }
  from './pages/budgets/budget-page/budget-page.component';

import { CompositionPageComponent }
  from './pages/compositions/composition-page/composition-page.component';

import { MaterialsPageComponent }
  from './pages/materials/materials-page/materials-page.component';

import { MaterialsQuotationPageComponent }
  from './pages/materials/materials-quotation/materials-quotation.component';

import { BituminousMaterialsComponent }
  from './pages/materials/bituminous-materials/bituminous-materials.component'

import { NerPageComponent } from './pages/brush_cutting/ner-page/ner-page.component';

import { BdiPageComponent }
  from './pages/bdi/bdi-page/bdi-page.component';

import { FitPageComponent }
  from './pages/fit/fit-page/fit-page.component';

import { AbcCompositionsPageComponent }
  from './pages/abc/compositions/abc-compositions-page.component';

import { OccurrencesMapComponent }
  from './pages/materials/occurrences-map/occurrences-map.component'

import {
  TransportsPageComponent
} from './pages/transports/transports-page.component';

import {
  TimelinePageComponent
} from './pages/timeline/timeline-page.component';

import {
  AnnualWorkPlanBudgetPageComponent
} from './pages/annual-work-plan-budget/annual-work-plan-budget-page.component';


export const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'projects'
  },

  {
    path: 'projects',
    component: ProjectsPageComponent
  },

  {
    path: 'projects/:id',
    component: ProjectPageComponent
  },

  {
    path: 'budgets',
    component: BudgetsPageComponent
  },

  {
    path: 'budgets/:id',
    component: BudgetPageComponent
  },

  {
    path: 'annual-work-plan-budget/:budgetId',
    component: AnnualWorkPlanBudgetPageComponent
  },

  {
    path: 'abc/:budgetId',
    component: AbcCompositionsPageComponent
  },

  {
    path: 'compositions/:code',
    component: CompositionPageComponent
  },

  {
    path: 'materials',
    component: MaterialsPageComponent
  },

  {
    path: 'materials-quotation',
    component: MaterialsQuotationPageComponent
  },

  {
    path: 'bituminous-material',
    component: BituminousMaterialsComponent
  },

  {
    path: 'mowing-workload-level',
    component: NerPageComponent
  },

  {
    path: 'bdi',
    component: BdiPageComponent
  },

  {
    path: 'fit',
    component: FitPageComponent
  },

  {
    path: 'occurrences',
    component: OccurrencesMapComponent
  },

  {
    path: 'logistics',
    component: TransportsPageComponent
  },

  {
    path: 'timeline/:budgetId',
    component: TimelinePageComponent
  },

];