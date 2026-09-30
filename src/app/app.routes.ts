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
    path: 'compositions/:code',
    component: CompositionPageComponent
  },

  {
    path: 'materials',
    component: MaterialsPageComponent
  }

];