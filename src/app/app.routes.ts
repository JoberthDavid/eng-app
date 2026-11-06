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
    path: 'projetos',
    component: ProjectsPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'projetos/:id',
    component: ProjectPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'orcamentos',
    component: BudgetsPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'orcamentos/:id',
    component: BudgetPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'plano-de-trabalho/:budgetId',
    component: AnnualWorkPlanBudgetPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'abc/:budgetId',
    component: AbcCompositionsPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'orcamentos/:budgetId/composicoes/:code',
    component: CompositionPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'materiais',
    component: MaterialsPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'cotacoes-de-materiais',
    component: MaterialsQuotationPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'materiais-betuminosos',
    component: BituminousMaterialsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'nivel-esforco-rocada',
    component: NerPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'bdi',
    component: BdiPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'bdi/:id',
    component: BdiPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'fit',
    component: FitPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'ocorrencias',
    component: OccurrencesMapComponent,
    canActivate: [authGuard]
  },

  {
    path: 'logistica',
    component: TransportsPageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'cronograma/:budgetId',
    component: TimelinePageComponent,
    canActivate: [authGuard]
  }

];