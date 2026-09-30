import {
  Component,
  inject
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { Budget } from '../../../models/budget.model';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss'
})
export class ProjectPageComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly projectService =
    inject(ProjectService);

  project: Project | null = null;

  showCreateBudgetForm = false;

  budgetForm = new FormGroup({
    referenceDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    methodology: new FormControl<
      'SC' | 'SN'
    >('SC', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    typeSystem: new FormControl<
      'ON' | 'DS' | 'NA'
    >('ON', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    highway: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    snv: new FormControl('', {
      nonNullable: true
    })
  });

  constructor() {
    const projectId =
      this.route.snapshot.paramMap.get('id');

    if (projectId) {
      this.project =
        this.projectService.getById(projectId);
    }
  }

  openCreateBudget(): void {
    this.budgetForm.reset({
      referenceDate:
        this.project?.referenceDate ?? '',

      methodology: 'SC',

      typeSystem: 'ON',

      highway: '',

      snv: ''
    });

    this.showCreateBudgetForm = true;
  }

  cancelCreateBudget(): void {
    this.showCreateBudgetForm = false;
  }

  createBudget(): void {
    if (
      !this.project ||
      this.budgetForm.invalid
    ) {
      this.budgetForm.markAllAsTouched();
      return;
    }

    const budget: Budget = {
      id: this.generateBudgetId(),

      projectId: this.project.id,

      referenceDate:
        this.budgetForm.controls.referenceDate.value,

      methodology:
        this.budgetForm.controls.methodology.value,

      typeSystem:
        this.budgetForm.controls.typeSystem.value,

      status: 'DRAFT',

      highway:
        this.budgetForm.controls.highway.value,

      SNV:
        this.parseSnv(
          this.budgetForm.controls.snv.value
        ),

      totalCost: '0,00',

      services: []
    };

    this.projectService.createBudget(
      this.project.id,
      budget
    );

    this.project =
      this.projectService.getById(
        this.project.id
      );

    this.showCreateBudgetForm = false;
  }

  private parseSnv(value: string): string[] {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  private generateBudgetId(): string {
    const projectBudgets =
      this.project?.budgets ?? [];

    return `ORC-${String(
      projectBudgets.length + 1
    ).padStart(3, '0')}`;
  }
}