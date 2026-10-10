import {
  Routes
} from '@angular/router';


/*
 * ============================================================
 * AUTENTICAÇÃO
 * ============================================================
 */

import {
  LoginPageComponent
} from './pages/auth/login/login-page.component';

import {
  TwoFactorPageComponent
} from './pages/auth/two-factor/two-factor-page.component';

import {
  authGuard
} from './core/auth/auth.guard';


/*
 * ============================================================
 * PÁGINAS EXISTENTES
 * ============================================================
 */

import {
  ProjectsPageComponent
} from './pages/projects/projects-page/projects-page.component';

import {
  ProjectPageComponent
} from './pages/projects/project-page/project-page.component';

import {
  BudgetsPageComponent
} from './pages/budgets/budgets-page/budgets-page.component';

import {
  BudgetPageComponent
} from './pages/budgets/budget-page/budget-page.component';

import {
  CompositionPageComponent
} from './pages/compositions/composition-page/composition-page.component';

import {
  MaterialsPageComponent
} from './pages/materials/materials-page/materials-page.component';

import {
  MaterialsQuotationPageComponent
} from './pages/materials/materials-quotation/materials-quotation.component';

import {
  BituminousMaterialsComponent
} from './pages/materials/bituminous-materials/bituminous-materials.component';

import {
  NerPageComponent
} from './pages/brush_cutting/ner-page/ner-page.component';

import {
  BdiPageComponent
} from './pages/bdi/bdi-page/bdi-page.component';

import {
  FitPageComponent
} from './pages/fit/fit-page/fit-page.component';

import {
  AbcCompositionsPageComponent
} from './pages/abc/compositions/abc-compositions-page.component';

import {
  OccurrencesMapComponent
} from './pages/materials/occurrences-map/occurrences-map.component';

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

  /*
   * ==========================================================
   * ROTAS PÚBLICAS
   * ==========================================================
   */

  {
    path: 'login',
    component: LoginPageComponent
  },

  {
    path: '2fa',
    component: TwoFactorPageComponent
  },


  /*
   * ==========================================================
   * ROTA RAIZ
   * ==========================================================
   *
   * A raiz continua levando para projetos.
   *
   * Se o usuário não estiver autenticado, o AuthGuard
   * interceptará a navegação e levará para /login.
   */

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'projects'
  },


  /*
   * ==========================================================
   * ROTAS PROTEGIDAS
   * ==========================================================
   */

  {
    path: 'projects',
    component: ProjectsPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'projects/:id',
    component: ProjectPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'budgets',
    component: BudgetsPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'budgets/:id',
    component: BudgetPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'annual-work-plan-budget/:budgetId',
    component: AnnualWorkPlanBudgetPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'abc/:budgetId',
    component: AbcCompositionsPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'compositions/:code',
    component: CompositionPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'materials',
    component: MaterialsPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'materials-quotation',
    component: MaterialsQuotationPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'bituminous-material',
    component: BituminousMaterialsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'mowing-workload-level',
    component: NerPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'bdi',
    component: BdiPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'fit',
    component: FitPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'occurrences',
    component: OccurrencesMapComponent,
    canActivate: [authGuard]
  },

  {
    path: 'logistics',
    component: TransportsPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'timeline/:budgetId',
    component: TimelinePageComponent,
    canActivate: [authGuard]
  }

];