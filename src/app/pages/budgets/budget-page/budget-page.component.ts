import {
  Component,
  inject
} from '@angular/core';

import {
  HttpErrorResponse
} from '@angular/common/http';

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
  Budget,
  ServiceItem,
  CompositionItem,
  CompositionCatalogItem
} from '../../../models/budget.model';

import {
  Project
} from '../../../models/project.model';

import {
  ProjectService
} from '../../../services/project.service';

import {
  CompositionCalculationRequest
} from '../../../core/integrations/composition/composition.models';

import {
  CompositionService
} from '../../../core/integrations/composition/composition.service';


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

  private readonly compositionService =
    inject(CompositionService);


  budget: Budget | null = null;

  project: Project | null = null;

  showCreateServiceForm = false;

  showAddCompositionForm = false;

  selectedService: ServiceItem | null = null;

  expandedServiceCode: string | null = null;

  compositions: CompositionCatalogItem[] = [];

  isCalculatingComposition = false;

  compositionCalculationError: string | null = null;


  constructor() {

    const budgetId =
      this.route.snapshot.paramMap.get('id');

    if (budgetId) {

      this.budget =
        this.projectService.getBudgetById(
          budgetId
        );

      if (this.budget) {

        this.project =
          this.projectService.getById(
            this.budget.projectId
          );

      }

    }

    this.compositions =
      this.buildCompositionOptions();

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


  /**
   * Monta as opções disponíveis no formulário.
   *
   * Além do catálogo demonstrativo, inclui as composições
   * que já estão vinculadas aos serviços deste orçamento.
   *
   * Isso permite selecionar uma composição existente mesmo
   * quando ela ainda não está no catálogo demonstrativo.
   */
  private buildCompositionOptions(): CompositionCatalogItem[] {

    const options =
      new Map<string, CompositionCatalogItem>();

    for (
      const composition of
      this.projectService.getCompositions()
    ) {

      options.set(
        composition.code,
        composition
      );

    }

    for (const service of this.budget?.services ?? []) {

      for (const composition of service.compositions) {

        options.set(
          composition.code,
          composition
        );

      }

    }

    return Array.from(options.values());

  }


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

    this.compositionForm.reset({
      code: '',
      referenceDate: '',
      factor: 1
    });

    this.compositionCalculationError = null;

    this.showAddCompositionForm = true;

  }


  cancelAddComposition(): void {

    if (this.isCalculatingComposition) {
      return;
    }

    this.selectedService = null;

    this.compositionCalculationError = null;

    this.showAddCompositionForm = false;

  }


  /**
   * Preenche a data de referência da composição selecionada.
   *
   * A data de referência não deve ser confundida com a
   * data-base monetária do projeto.
   *
   * O input HTML do tipo date utiliza o formato ISO.
   */
  onCompositionSelected(
    event: Event
  ): void {

    const select =
      event.target as HTMLSelectElement;

    const composition =
      this.compositions.find(
        item => item.code === select.value
      );

    this.compositionCalculationError = null;

    if (!composition) {

      this.compositionForm.controls.referenceDate.setValue('');

      return;

    }

    try {

      this.compositionForm.controls.referenceDate.setValue(
        this.normalizeDateForApi(
          composition.referenceDate
        )
      );

    } catch (error: unknown) {

      this.compositionForm.controls.referenceDate.setValue('');

      this.compositionCalculationError =
        this.getCalculationErrorMessage(error);

    }

  }


  /**
   * Solicita o cálculo da composição ao Composition Engine
   * exclusivamente por meio do Manifold API.
   *
   * O custo unitário é retornado pelo backend.
   * O Angular não executa o cálculo do custo da composição.
   */
  addComposition(): void {

    const budget = this.budget;

    const project = this.project;

    const selectedService = this.selectedService;


    if (
      !budget ||
      !project ||
      !selectedService ||
      this.compositionForm.invalid ||
      this.isCalculatingComposition
    ) {

      this.compositionForm.markAllAsTouched();

      return;

    }


    const compositionCode =
      this.compositionForm.controls.code.value;

    const catalogComposition =
      this.compositions.find(
        item => item.code === compositionCode
      );


    if (!catalogComposition) {

      this.compositionCalculationError =
        'A composição selecionada não foi encontrada.';

      return;

    }


    const factor =
      this.compositionForm.controls.factor.value;


    let request: CompositionCalculationRequest;


    /*
     * Converte as datas para o formato esperado pelo backend.
     *
     * Atualmente, os dados demonstrativos do frontend usam
     * DD/MM/AAAA, enquanto o Composition Engine recebe AAAA-MM-DD.
     */
    try {

      request = {

        composition_code:
          catalogComposition.code,

        source_file_uf:
          project.uf,

        type_system:
          budget.typeSystem,

        methodology:
          budget.methodology,

        monetary_base_date:
          this.normalizeDateForApi(
            project.monetaryBaseDate
          ),

        reference_base_date:
          this.normalizeDateForApi(
            this.compositionForm.controls.referenceDate.value
          )

      };

    } catch (error: unknown) {

      this.compositionCalculationError =
        this.getCalculationErrorMessage(error);

      return;

    }


    this.compositionCalculationError = null;

    this.isCalculatingComposition = true;


    this.compositionService
      .calculate(request)
      .subscribe({

        next: response => {

          /*
           * O backend retorna o custo unitário.
           *
           * A quantidade da composição no serviço segue
           * a regra definida no modelo do frontend:
           *
           * quantidade do serviço × fator da composição.
           */
          const composition: CompositionItem = {

            ...catalogComposition,

            code:
              response.composition_id,

            referenceDate:
              this.formatDateForDisplay(
                response.reference_base_date
              ),

            factor,

            quantity:
              selectedService.quantity * factor,

            /*
             * Mantemos o custo unitário retornado pelo backend
             * como string para preservar sua representação decimal.
             */
            unitCost:
              String(response.unit_cost),

            /*
             * O endpoint atual não retorna o custo total
             * da ocorrência no serviço.
             *
             * O custo total deverá ser fornecido pela etapa
             * de cálculo do orçamento/backend correspondente.
             */
            totalCost: '—'

          };


          this.projectService.addCompositionToService(
            budget.id,
            selectedService.code,
            composition
          );


          this.showAddCompositionForm = false;

          this.selectedService = null;

        },

        error: (error: unknown) => {

          this.compositionCalculationError =
            this.getCalculationErrorMessage(error);

          this.isCalculatingComposition = false;

        },

        complete: () => {

          this.isCalculatingComposition = false;

        }

      });

  }


  /**
   * Formata um custo decimal para exibição em reais.
   *
   * A conversão numérica acontece apenas para apresentação.
   * O valor original continua armazenado como string.
   */
  formatMoney(value: string): string {

    const normalizedValue = value.trim();

    if (
      normalizedValue.startsWith('R$') ||
      normalizedValue === '—'
    ) {

      return normalizedValue;

    }

    const amount = Number(normalizedValue);

    if (!Number.isFinite(amount)) {
      return value;
    }

    return new Intl.NumberFormat(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL'
      }
    ).format(amount);

  }


  /**
   * Normaliza datas DD/MM/AAAA ou AAAA-MM-DD
   * para o formato ISO exigido pela API.
   */
  private normalizeDateForApi(
    value: string
  ): string {

    const normalizedValue = value.trim();


    const isoMatch =
      /^(\d{4})-(\d{2})-(\d{2})$/.exec(
        normalizedValue
      );

    if (isoMatch) {

      return this.validateIsoDate(
        normalizedValue
      );

    }


    const brazilianMatch =
      /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(
        normalizedValue
      );

    if (brazilianMatch) {

      const isoDate =
        `${brazilianMatch[3]}-${brazilianMatch[2]}-${brazilianMatch[1]}`;

      return this.validateIsoDate(isoDate);

    }


    throw new Error(
      `Data inválida: "${value}". Utilize DD/MM/AAAA ou AAAA-MM-DD.`
    );

  }


  /**
   * Verifica se a data ISO representa uma data válida.
   */
  private validateIsoDate(
    value: string
  ): string {

    const match =
      /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!match) {

      throw new Error(
        `Data inválida: "${value}".`
      );

    }


    const year = Number(match[1]);

    const month = Number(match[2]);

    const day = Number(match[3]);


    const date =
      new Date(
        Date.UTC(
          year,
          month - 1,
          day
        )
      );


    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {

      throw new Error(
        `A data "${value}" não é válida.`
      );

    }


    return value;

  }


  /**
   * Converte datas ISO para DD/MM/AAAA na interface.
   *
   * Datas que já estão no formato brasileiro são preservadas.
   */
  private formatDateForDisplay(
    value: string
  ): string {

    if (
      /^\d{2}\/\d{2}\/\d{4}$/.test(value)
    ) {

      return value;

    }


    const match =
      /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!match) {
      return value;
    }


    return `${match[3]}/${match[2]}/${match[1]}`;

  }


  /**
   * Converte erros HTTP ou de validação em mensagens
   * que possam ser apresentadas no formulário.
   */
  private getCalculationErrorMessage(
    error: unknown
  ): string {

    if (error instanceof HttpErrorResponse) {

      const detail = error.error?.detail;

      if (typeof detail === 'string') {
        return detail;
      }

      if (
        typeof error.error === 'string' &&
        error.error.trim()
      ) {

        return error.error;

      }

      if (error.status === 0) {

        return (
          'Não foi possível conectar ao Manifold API. ' +
          'Verifique se o backend está disponível.'
        );

      }

      return (
        `Não foi possível calcular a composição. ` +
        `Resposta HTTP ${error.status}.`
      );

    }


    if (error instanceof Error) {
      return error.message;
    }


    return 'Ocorreu um erro durante o cálculo da composição.';

  }


  toggleService(service: ServiceItem): void {

    if (
      this.expandedServiceCode === service.code
    ) {

      this.expandedServiceCode = null;

      return;

    }

    this.expandedServiceCode = service.code;

  }

}