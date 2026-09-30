import {
  Component,
  inject
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  Budget,
  ServiceItem,
  CompositionItem
} from '../../../models/budget.model';

import {
  ProjectService
} from '../../../services/project.service';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-budget-page',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './budget-page.component.html',
  styleUrl: './budget-page.component.scss'
})
export class BudgetPageComponent {

  private readonly route =
    inject(ActivatedRoute);

  private readonly projectService =
    inject(ProjectService);

  budget: Budget | null = null;

  showCreateServiceForm = false;

  showAddCompositionForm = false;

  selectedService: ServiceItem | null = null;

  expandedServiceCode: string | null = null;

  compositions: CompositionItem[] =
    this.projectService.getCompositions();

  constructor() {
    const budgetId =
      this.route.snapshot.paramMap.get('id');

    if (budgetId) {
      this.budget =
        this.projectService.getBudgetById(
          budgetId
        );
    }
  }

  serviceForm = new FormGroup({
    code: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    description: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    unit: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    quantity: new FormControl(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(0)
      ]
    })
  });

  compositionForm = new FormGroup({
    code: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    referenceDate: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    factor: new FormControl(1, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(0.000001)
      ]
    })
  });

  openCreateService(): void {
  this.serviceForm.reset({
    code: '',
    description: '',
    unit: '',
    quantity: 0
  });

    this.showCreateServiceForm = true;
  }

  cancelCreateService(): void {
    this.showCreateServiceForm = false;
  }

  createService(): void {
    if (
      !this.budget ||
      this.serviceForm.invalid
    ) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const service: ServiceItem = {
      code:
        this.serviceForm.controls.code.value,

      description:
        this.serviceForm.controls.description.value,

      unit:
        this.serviceForm.controls.unit.value,

      quantity:
        this.serviceForm.controls.quantity.value,

      compositions: []
    };

    this.projectService.addServiceToBudget(
      this.budget.id,
      service
    );

    this.showCreateServiceForm = false;
  }

  openAddComposition(
    service: ServiceItem
  ): void {
    this.selectedService = service;
    this.showAddCompositionForm = true;
  }

  cancelAddComposition(): void {
    this.selectedService = null;
    this.showAddCompositionForm = false;
  }

  onCompositionSelected(
    event: Event
  ): void {
    const select =
      event.target as HTMLSelectElement;

    const code = select.value;

    const composition =
      this.projectService.getComposition(code);

    this.compositionForm.patchValue({
      referenceDate:
        composition?.referenceDate ?? ''
    });
  }

  addComposition(): void {
    if (
      !this.budget ||
      !this.selectedService ||
      this.compositionForm.invalid
    ) {
      this.compositionForm.markAllAsTouched();
      return;
    }

    const code =
      this.compositionForm.controls.code.value;

    const catalogComposition =
      this.projectService.getComposition(code);

    if (!catalogComposition) {
      return;
    }

    const composition: CompositionItem = {
      ...catalogComposition,

      referenceDate:
        this.compositionForm.controls.referenceDate.value,

      factor:
        this.compositionForm.controls.factor.value,

      unitCost: '0,00',

      totalCost: '0,00'
    };

    this.projectService.addCompositionToService(
      this.budget.id,
      this.selectedService.code,
      composition
    );

    this.showAddCompositionForm = false;
    this.selectedService = null;
  }

  toggleService(service: ServiceItem): void {
  if (this.expandedServiceCode === service.code) {
      this.expandedServiceCode = null;
      return;
    }

    this.expandedServiceCode = service.code;
  }

}