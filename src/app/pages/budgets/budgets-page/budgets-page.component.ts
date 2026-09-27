import { Component } from '@angular/core';

interface BudgetSummary {
  project: string;
  referenceDate: string;
  status: string;
  total: string;
}

@Component({
  selector: 'app-budgets-page',
  standalone: true,
  imports: [],
  templateUrl: './budgets-page.component.html',
  styleUrl: './budgets-page.component.scss'
})
export class BudgetsPageComponent {
  pageTitle = 'Orçamentos';

  budgets: BudgetSummary[] = [
    {
      project: 'BR-060/GO',
      referenceDate: '01/07/2026',
      status: 'Rascunho',
      total: '—'
    },
    {
      project: 'BR-040/DF',
      referenceDate: '01/06/2026',
      status: 'Calculado',
      total: 'R$ 1.248.530,42'
    },
    {
      project: 'BR-153/GO',
      referenceDate: '01/05/2026',
      status: 'Finalizado',
      total: 'R$ 876.240,18'
    }
  ];

  message = '';

  newBudget(): void {
    this.message = 'Fluxo de criação de orçamento ainda será implementado.';
  }
}