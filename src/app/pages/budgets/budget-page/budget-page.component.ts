import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BudgetService } from '../../../services/budget.service';

@Component({
  selector: 'app-budget-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './budget-page.component.html',
  styleUrl: './budget-page.component.scss'
})
export class BudgetPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly budgetService = inject(BudgetService);

  readonly projectId = this.route.snapshot.paramMap.get('id');
  readonly budgetId = this.route.snapshot.paramMap.get('budgetId');
  readonly budget = this.projectId && this.budgetId ? this.budgetService.getBudget( this.projectId, this.budgetId ) : null;
}