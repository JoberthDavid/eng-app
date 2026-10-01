import {
  Component,
  inject
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  AnnualWorkPlanBudget,
  AnnualWorkPlanBudgetComposition,
  AnnualWorkPlanBudgetCompositionPlan,
  AnnualWorkPlanBudgetGroup,
  AnnualWorkPlanBudgetPlan,
  AnnualWorkPlanBudgetServiceItem,
  AnnualWorkPlanBudgetServicePlan
} from '../../models/annual-work-plan-budget.models';

import {
  AnnualWorkPlanBudgetService
} from '../../services/annual-work-plan-budget.service';


@Component({
  selector:
    'app-annual-work-plan-budget-page',

  standalone:
    true,

  imports: [
    RouterLink
  ],

  templateUrl:
    './annual-work-plan-budget-page.component.html',

  styleUrl:
    './annual-work-plan-budget-page.component.scss'
})
export class AnnualWorkPlanBudgetPageComponent {

  private readonly route =
    inject(ActivatedRoute);

  private readonly annualWorkPlanBudgetService =
    inject(AnnualWorkPlanBudgetService);

  readonly budgetId =
    this.route.snapshot.paramMap.get(
      'budgetId'
    ) ?? '';

  pato:
    AnnualWorkPlanBudget | null =
      this.annualWorkPlanBudgetService
        .getByBudgetId(this.budgetId);

  expandedGroups =
    new Set<string>();

  expandedServices =
    new Set<string>();


  get groups(): AnnualWorkPlanBudgetGroup[] {

    return this.pato?.structure.groups ?? [];

  }


  get activePlan(): AnnualWorkPlanBudgetPlan | null {

    return this.pato?.plans[0] ?? null;

  }


  get referenceYear(): string {

    return this.activePlan?.year ?? '';

  }


  get referenceDate(): string {

    if (!this.activePlan) {
      return '';
    }

    return this.formatDate(
      this.activePlan.startDate
    );

  }


  getServicePlan(
    serviceId: string
  ): AnnualWorkPlanBudgetServicePlan | null {

    return this.activePlan?.servicePlans
      .find(
        servicePlan =>
          servicePlan.serviceId === serviceId
      ) ?? null;

  }


  getMeasurement(
    serviceId: string
  ) {

    return this.getServicePlan(
      serviceId
    )?.measurement ?? null;

  }


  getCompositionPlan(
    serviceId: string,
    compositionId: string
  ): AnnualWorkPlanBudgetCompositionPlan | null {

    return this.getServicePlan(
      serviceId
    )?.compositions
      .find(
        composition =>
          composition.compositionId === compositionId
      ) ?? null;

  }


  toggleGroup(
    group: AnnualWorkPlanBudgetGroup
  ): void {

    if (
      this.expandedGroups.has(group.id)
    ) {

      this.expandedGroups.delete(
        group.id
      );

      return;
    }

    this.expandedGroups.add(
      group.id
    );

  }


  toggleService(
    service: AnnualWorkPlanBudgetServiceItem
  ): void {

    if (
      this.expandedServices.has(
        service.id
      )
    ) {

      this.expandedServices.delete(
        service.id
      );

      return;
    }

    this.expandedServices.add(
      service.id
    );

  }


  isGroupExpanded(
    groupId: string
  ): boolean {

    return this.expandedGroups.has(
      groupId
    );

  }


  isServiceExpanded(
    serviceId: string
  ): boolean {

    return this.expandedServices.has(
      serviceId
    );

  }


  calculateQuantities(): void {

    if (!this.pato) {
      return;
    }

    this.annualWorkPlanBudgetService
      .requestQuantityCalculation(
        this.pato.budgetId
      );

  }


  applyToBudget(): void {

    if (!this.pato) {
      return;
    }

    this.annualWorkPlanBudgetService
      .requestBudgetUpdate(
        this.pato.budgetId
      );

  }


  generateReport(): void {

    if (!this.pato) {
      return;
    }

    this.annualWorkPlanBudgetService
      .requestReport(
        this.pato.budgetId
      );

  }


  private formatDate(
    date: string
  ): string {

    const [
      year,
      month,
      day
    ] = date.split('-');

    if (
      !year ||
      !month ||
      !day
    ) {
      return date;
    }

    return `${day}/${month}/${year}`;

  }

}