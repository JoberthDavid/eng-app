import {
  Component,
  inject
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  TimelineMonth,
  TimelineResult,
  TimelineRow,
  TimelineView
} from '../../models/timeline.models';

import {
  TimelineService
} from '../../services/timeline.service';


@Component({
  selector: 'app-Timeline-page',

  standalone: true,

  imports: [
    RouterLink,
    ReactiveFormsModule
  ],

  templateUrl:
    './timeline-page.component.html',

  styleUrl:
    './timeline-page.component.scss'
})
export class TimelinePageComponent {


  private readonly route =
    inject(ActivatedRoute);

  private readonly TimelineService =
    inject(TimelineService);


  readonly budgetId:
    string | null =
      this.route.snapshot.paramMap
        .get('budgetId');


  readonly timeline:
    TimelineResult | null =
      this.budgetId

        ? this.TimelineService
            .getTimeline(this.budgetId)

        : null;


  selectedYear =
    '2027';


  view:
    TimelineView =
      'PERCENTUAL';


  expandedGroups:
    string[] = [];


  configurationForm =
    new FormGroup({

      contractTermMonths:
        new FormControl(
          this.timeline
            ?.contractTermMonths ?? '24',
          {
            nonNullable: true,
            validators: [
              Validators.required
            ]
          }
        ),

      startDate:
        new FormControl(
          this.timeline
            ?.startDate ?? '',
          {
            nonNullable: true,
            validators: [
              Validators.required
            ]
          }
        )

    });


  // ==========================================================
  // MESES
  // ==========================================================

  get visibleMonths():
    TimelineMonth[] {

    return (
      this.timeline?.months
        .filter(
          month =>
            month.year ===
            this.selectedYear
        )
      ?? []
    );

  }


  get years():
    string[] {

    const years =
      this.timeline?.months
        .map(month => month.year)
      ?? [];

    return [
      ...new Set(years)
    ];

  }


  // ==========================================================
  // LINHAS
  // ==========================================================

  get visibleRows():
    TimelineRow[] {

    return (
      this.timeline?.rows
      ?? []
    );

  }


  // ==========================================================
  // ABAS DE ANO
  // ==========================================================

  selectYear(
    year: string
  ): void {

    this.selectedYear =
      year;

  }


  // ==========================================================
  // VISUALIZAÇÃO
  // ==========================================================

  selectView(
    view: TimelineView
  ): void {

    this.view =
      view;

  }


  isPercentageView(): boolean {

    return (
      this.view ===
      'PERCENTUAL'
    );

  }


  // ==========================================================
  // VALOR MENSAL
  // ==========================================================

  getMonthValue(
    row: TimelineRow,
    month: TimelineMonth
  ): string {

    const index =
      Number(month.number) - 1;

    return this.isPercentageView()

      ? (
          row.monthlyPercentages[index]
          ?? '—'
        )

      : (
          row.monthlyValues[index]
          ?? '—'
        );

  }


  // ==========================================================
  // EXPANSÃO
  // ==========================================================

  toggleGroup(
    code: string
  ): void {

    if (
      this.expandedGroups
        .includes(code)
    ) {

      this.expandedGroups =
        this.expandedGroups
          .filter(
            item =>
              item !== code
          );

      return;
    }

    this.expandedGroups = [
      ...this.expandedGroups,
      code
    ];

  }


  isExpanded(
    code: string
  ): boolean {

    return this.expandedGroups
      .includes(code);

  }


  // ==========================================================
  // CONFIGURAÇÃO
  // ==========================================================

  saveConfiguration(): void {

    if (
      this.configurationForm.invalid
    ) {

      this.configurationForm
        .markAllAsTouched();

      return;
    }

    /*
     * Nesta etapa o formulário apenas representa
     * os parâmetros que serão enviados futuramente
     * para a API Python.
     *
     * Não fazemos aqui:
     * - distribuição mensal;
     * - cálculo financeiro;
     * - soma de percentuais;
     * - curva S.
     */

    console.info(
      'Parâmetros do Timeline:',
      this.configurationForm
        .getRawValue()
    );

  }


  // ==========================================================
  // RELATÓRIO
  // ==========================================================

  printReport(): void {

    window.print();

  }


  requestPdfReport(): void {

    if (!this.budgetId) {
      return;
    }

    this.TimelineService
      .requestReport(
        this.budgetId
      );

  }


  // ==========================================================
  // TRACK
  // ==========================================================

  trackMonth(
    _index: number,
    month: TimelineMonth
  ): string {

    return month.number;

  }


  trackRow(
    _index: number,
    row: TimelineRow
  ): string {

    return row.code;

  }

}