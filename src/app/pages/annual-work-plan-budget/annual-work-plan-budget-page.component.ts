import {
  Component,
  inject
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { FormsModule } from '@angular/forms';

import {
  AnnualWorkPlanBudget,
  AnnualWorkPlanBudgetCompositionPlan,
  AnnualWorkPlanBudgetGroup,
  AnnualWorkPlanBudgetPlan,
  AnnualWorkPlanBudgetServiceItem,
  AnnualWorkPlanBudgetServicePlan,

} from '../../models/annual-work-plan-budget.models';

import { SicroItem,
} from '../../models/sicro.models';

import {
  AnnualWorkPlanBudgetService,
} from '../../services/annual-work-plan-budget.service';

import {
  SicroCompositionCatalogService,
} from '../../services/sicro-composition-catalog.service';  


@Component({
  selector: 'app-annual-work-plan-budget-page',

  standalone: true,

  imports: [
    RouterLink,
    FormsModule
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

  private readonly sicroCompositionCatalogService =
    inject(SicroCompositionCatalogService);

  readonly budgetId =
    this.route.snapshot.paramMap.get(
      'budgetId'
    ) ?? '';


  pato:
    AnnualWorkPlanBudget | null =
      this.annualWorkPlanBudgetService
        .getByBudgetId(this.budgetId);


  activePlanId =
    this.pato?.plans[0]?.id ?? '';


  expandedGroups =
    new Set<string>();

  expandedServices =
    new Set<string>();


  showGroupForm = false;

  newGroupCode = '';

  newGroupDescription = '';


  showServiceForm = false;

  serviceFormGroupId = '';

  newServiceCode = '';

  newServiceDescription = '';

  showCompositionForm = false;

  compositionFormServiceId = '';

  compositionSearchCode = '';

  compositionSearchDescription = '';

  compositionSearchResults: SicroItem[] = [];

  compositionSearchLoading = false;

  compositionSearchError = '';

  get groups(): AnnualWorkPlanBudgetGroup[] {

    return this.pato?.structure.groups ?? [];

  }


  get plans(): AnnualWorkPlanBudgetPlan[] {

    return this.pato?.plans ?? [];

  }


  get activePlan(): AnnualWorkPlanBudgetPlan | null {

    return this.plans.find(
      plan =>
        plan.id === this.activePlanId
    ) ?? null;

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


  selectPlan(
    planId: string
  ): void {

    this.activePlanId = planId;

    this.expandedServices.clear();

  }


  isActivePlan(
    planId: string
  ): boolean {

    return this.activePlanId === planId;

  }


  getPlanModeLabel(
    plan: AnnualWorkPlanBudgetPlan
  ): string {

    if (plan.mode === 'REPEAT') {

      const sourcePlan =
        this.plans.find(
          candidate =>
            candidate.id === plan.sourcePlanId
        );

      if (sourcePlan) {
        return `Repetição de ${sourcePlan.year}`;
      }

      return 'Repetição';

    }

    return 'Independente';

  }


  getServicePlan(
    serviceId: string
  ): AnnualWorkPlanBudgetServicePlan | null {

    return this.activePlan
      ?.servicePlans
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

    if (this.expandedGroups.has(group.id)) {

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


  openGroupForm(): void {

    this.showGroupForm = true;

    this.showServiceForm = false;

    this.newGroupCode =
      this.getNextGroupCode();

    this.newGroupDescription = '';

  }


  cancelGroupForm(): void {

    this.showGroupForm = false;

    this.newGroupCode = '';

    this.newGroupDescription = '';

  }


  addGroup(): void {

    const code =
      this.newGroupCode.trim();

    const description =
      this.newGroupDescription.trim();

    if (!code || !description) {
      return;
    }

    const group =
      this.annualWorkPlanBudgetService.addGroup(
        this.budgetId,
        code,
        description
      );

    if (!group) {
      return;
    }

    this.expandedGroups.add(
      group.id
    );

    this.cancelGroupForm();

  }

  private getNextGroupCode(): string {

    const numericCodes =
      this.groups
        .map(group => Number(group.code))
        .filter(code => Number.isFinite(code));

    const nextCode =
      numericCodes.length > 0
        ? Math.max(...numericCodes) + 1
        : 1;

    return String(nextCode).padStart(2, '0');
  }


  openServiceForm(
    groupId: string
  ): void {

    const group =
      this.groups.find(
        item => item.id === groupId
      );

    if (!group) {
      return;
    }

    this.serviceFormGroupId =
      groupId;

    this.showServiceForm =
      true;

    this.showGroupForm =
      false;

    this.newServiceCode =
      this.getNextServiceCode(group);

    this.newServiceDescription =
      '';

    this.expandedGroups.add(
      groupId
    );

  }


  cancelServiceForm(): void {

    this.showServiceForm = false;

    this.serviceFormGroupId = '';

    this.newServiceCode = '';

    this.newServiceDescription = '';

  }


  addService(): void {

    const code =
      this.newServiceCode.trim();

    const description =
      this.newServiceDescription.trim();

    if (
      !this.serviceFormGroupId ||
      !code ||
      !description
    ) {
      return;
    }

    const service =
      this.annualWorkPlanBudgetService.addService(
        this.budgetId,
        this.serviceFormGroupId,
        code,
        description
      );

    if (!service) {
      return;
    }

    this.expandedGroups.add(
      this.serviceFormGroupId
    );

    this.cancelServiceForm();

  }

  private getNextServiceCode(
    group: AnnualWorkPlanBudgetGroup
  ): string {

    const prefix =
      group.code.padStart(2, '0');

    const serviceNumbers =
      group.services
        .map(service => {

          const parts =
            service.code.split('.');

          return Number(
            parts[parts.length - 1]
          );

        })
        .filter(
          code => Number.isFinite(code)
        );

    const nextNumber =
      serviceNumbers.length > 0
        ? Math.max(...serviceNumbers) + 1
        : 1;

    return `${prefix}.${String(nextNumber).padStart(2, '0')}`;
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

  openCompositionForm(
    serviceId: string
  ): void {

    this.compositionFormServiceId =
      serviceId;

    this.showCompositionForm =
      true;

    this.compositionSearchCode =
      '';

    this.compositionSearchDescription =
      '';

    this.compositionSearchResults =
      [];

    this.compositionSearchError =
      '';

    this.expandedServices.add(
      serviceId
    );

  }

  cancelCompositionForm(): void {

    this.showCompositionForm =
      false;

    this.compositionFormServiceId =
      '';

    this.compositionSearchCode =
      '';

    this.compositionSearchDescription =
      '';

    this.compositionSearchResults =
      [];

    this.compositionSearchError =
      '';

  }

  searchCompositions(): void {

    this.compositionSearchLoading =
      true;

    this.compositionSearchError =
      '';

    this.compositionSearchResults =
      [];

    this.sicroCompositionCatalogService
      .search(
        this.compositionSearchCode,
        this.compositionSearchDescription
      )
      .subscribe({

        next: response => {

          this.compositionSearchResults =
            response.results;

          this.compositionSearchLoading =
            false;

        },

        error: error => {

          console.error(
            'Erro ao consultar catálogo SICRO:',
            error
          );

          this.compositionSearchError =
            'Não foi possível consultar o catálogo SICRO.';

          this.compositionSearchLoading =
            false;

        }

      });

  }

  getSicroDescription(
    item: SicroItem
  ): string {

    return item.descriptions
      .find(
        description =>
          description.group === 'CO'
      )
      ?.description ?? '';

  }

  addCompositionFromCatalog(
    item: SicroItem
  ): void {

    if (!this.pato) {
      return;
    }

    const description =
      item.descriptions.find(
        itemDescription =>
          itemDescription.group === 'CO'
      );

    if (!description) {
      return;
    }

    const composition =
      this.annualWorkPlanBudgetService
        .addComposition(
          this.budgetId,
          this.compositionFormServiceId,
          String(item.id),
          item.code,
          description.description,
          '',
          '1,0000'
        );

    if (!composition) {
      return;
    }

    this.cancelCompositionForm();

    this.expandedServices.add(
      composition.serviceId
    );

  }

}