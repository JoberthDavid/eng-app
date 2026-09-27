import { Injectable, inject } from '@angular/core';

import { Budget } from '../models/budget.model';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private readonly projectService = inject(ProjectService);

  getBudget(projectId: string, budgetId: string): Budget | null {
    const project = this.projectService.getProject(projectId);

    if (!project) {
      return null;
    }

    return project.budgets.find(budget => budget.id === budgetId) ?? null;
  }
}