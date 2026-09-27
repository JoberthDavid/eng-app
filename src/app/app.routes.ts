import { Routes } from '@angular/router';
import { BudgetsPageComponent } from './pages/budgets/budgets-page/budgets-page.component';
import { ProjectPageComponent } from './pages/projects/project-page/project-page.component';
import { ProjectsPageComponent } from './pages/projects/projects-page/projects-page.component';
import { BudgetPageComponent } from './pages/budgets/budget-page/budget-page.component';


export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'projects'
  },
  {
    path: 'budgets',
    component: BudgetsPageComponent
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
    path: 'projects/:id/budgets/:budgetId',
    component: BudgetPageComponent
  },
];