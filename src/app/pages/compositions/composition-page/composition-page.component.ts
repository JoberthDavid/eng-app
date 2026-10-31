import {
  Component,
  effect,
  OnDestroy,
  inject
} from '@angular/core';

import {
  ActivatedRoute
} from '@angular/router';

import {
  catchError,
  forkJoin,
  of,
  Subscription
} from 'rxjs';

import {
  CompositionCalculationDetailResponse,
  CompositionCalculationRequest,
  CompositionSectionTotals
} from '../../../core/integrations/composition/composition.models';

import {
  CompositionService
} from '../../../core/integrations/composition/composition.service';

import {
  ProjectService
} from '../../../services/project.service';

import {
  CompositionTreeService
} from '../../../services/composition-tree.service';

import {
  CompositionNavigationService
} from '../../../services/composition-navigation.service';

import {
  CompositionTreeNode
} from '../../../models/composition-tree.model';

import {
  CompositionCatalogItem
} from '../../../models/budget.model';

import {
  CompositionPanelComponent
} from '../../../components/composition-panel/composition-panel.component';

import {
  CompositionCatalogData,
  CompositionCatalogService
} from '../../../services/composition-catalog.service';

@Component({
  selector: 'app-composition-page',
  standalone: true,
  imports: [
    CompositionPanelComponent
  ],
  templateUrl: './composition-page.component.html',
  styleUrl: './composition-page.component.scss'
})
export class CompositionPageComponent
  implements OnDestroy {

  private readonly route =
    inject(ActivatedRoute);


  private readonly projectService =
    inject(ProjectService);


  private readonly compositionService =
    inject(CompositionService);


  private readonly compositionTreeService =
    inject(CompositionTreeService);


  private readonly compositionNavigationService =
    inject(CompositionNavigationService);

  private readonly compositionCatalogService =
      inject(CompositionCatalogService);

  readonly selectedNode =
    this.compositionNavigationService.selectedNode;


  readonly budgetId =
    this.route.snapshot.paramMap.get('budgetId');


  readonly compositionCode =
    this.route.snapshot.paramMap.get('code');


  readonly budget =
    this.budgetId
      ? this.projectService.getBudgetById(
          this.budgetId
        )
      : null;


  readonly project =
    this.budget
      ? this.projectService.getById(
          this.budget.projectId
        )
      : null;


  composition =
    this.budgetId && this.compositionCode
      ? this.projectService.getCompositionByBudget(
          this.budgetId,
          this.compositionCode
        )
      : null;


  compositionTree: CompositionTreeNode | null = null;

  calculation: CompositionCalculationDetailResponse | null = null;

  sectionTotals: CompositionSectionTotals | null = null;

  compositionCatalog: CompositionCatalogData | null = null;

  isCalculating = false;

  calculationError: string | null = null;

  selectedCalculation: CompositionCalculationDetailResponse | null = null;

  selectedSectionTotals: CompositionSectionTotals | null = null;

  selectedCompositionCatalog: CompositionCatalogData | null = null;

  isSelectedCompositionLoading = false;

  selectedCompositionError: string | null = null;

  private selectedCompositionSubscription: Subscription | null = null;


  constructor() {

    this.compositionNavigationService.setActiveTree(
      this.compositionTree
    );

    effect(() => {
      const selected = this.selectedNode();

      if (!selected || selected.referenceType === 'ROOT') {
        this.clearSelectedComposition();
        return;
      }

      this.loadSelectedComposition(selected);
    });

    this.loadCompositionCatalog();

    this.calculateComposition();

  }

  private loadCompositionCatalog(): void {

    if (!this.composition) {
      this.compositionCatalog = null;
      return;
    }

    this.compositionCatalogService
      .getCompositionByCode(
        this.composition.code,
        this.composition.referenceDate
      )
      .subscribe({
        next: catalog => {
          this.compositionCatalog = catalog;
        },

        error: error => {
          console.error(
            'Erro ao carregar catálogo da composição:',
            error
          );

          this.compositionCatalog = null;
        }
      });

  }

  private calculateComposition(): void {

    if (
      !this.composition ||
      !this.budget ||
      !this.project
    ) {

      this.calculationError =
        'Não foi possível determinar o contexto da composição.';

      return;

    }

    const composition = this.composition;

    const request = this.createCalculationRequest(composition);

    if (!request) {
      this.calculationError =
        'Não foi possível determinar o contexto da composição.';
      return;
    }


    this.isCalculating = true;

    this.calculationError = null;


    this.compositionService
      .calculateDetail(request)
      .subscribe({

          next: response => {

            this.calculation =
              response;

            this.sectionTotals =
              this.calculateSectionTotals(response);

            this.compositionTree =
              this.compositionTreeService.buildTreeFromReferences(
                composition,
                response.detail.composition_references
              );

            this.compositionNavigationService.setActiveTree(
              this.compositionTree
            );

            this.isCalculating = false;

          },


        error: error => {

          console.error(
            'Erro ao calcular composição:',
            error
          );

          this.calculationError =
            'Não foi possível calcular a composição.';

          this.isCalculating = false;

        }

      });

  }

  private loadSelectedComposition(
    node: CompositionTreeNode
  ): void {
    this.selectedCompositionSubscription?.unsubscribe();

    this.selectedCalculation = null;
    this.selectedSectionTotals = null;
    this.selectedCompositionCatalog = null;
    this.selectedCompositionError = null;

    const request = this.createCalculationRequest(node.composition);

    if (!request) {
      this.selectedCompositionError =
        'Não foi possível determinar o contexto da composição selecionada.';
      return;
    }

    this.isSelectedCompositionLoading = true;

    this.selectedCompositionSubscription = forkJoin({
      catalog: this.compositionCatalogService
        .getCompositionByCode(
          node.composition.code,
          node.composition.referenceDate
        )
        .pipe(
          catchError(error => {
            console.error(
              'Erro ao carregar catálogo da composição selecionada:',
              error
            );

            return of(null);
          })
        ),
      calculation: this.compositionService.calculateDetail(request)
    }).subscribe({
      next: response => {
        this.selectedCompositionCatalog = response.catalog;
        this.selectedCalculation = response.calculation;
        this.selectedSectionTotals =
          this.calculateSectionTotals(response.calculation);

        if (this.compositionTree) {
          this.compositionTree =
            this.compositionTreeService.replaceNodeChildren(
              this.compositionTree,
              node,
              response.calculation.detail.composition_references
            );

          this.compositionNavigationService.updateActiveTree(
            this.compositionTree
          );
        }

        this.isSelectedCompositionLoading = false;
      },
      error: error => {
        console.error(
          'Erro ao carregar composição selecionada:',
          error
        );

        this.selectedCompositionError =
          'Não foi possível carregar os detalhes da composição selecionada.';
        this.isSelectedCompositionLoading = false;
      }
    });
  }

  private clearSelectedComposition(): void {
    this.selectedCompositionSubscription?.unsubscribe();
    this.selectedCompositionSubscription = null;

    this.selectedCalculation = null;
    this.selectedSectionTotals = null;
    this.selectedCompositionCatalog = null;
    this.selectedCompositionError = null;
    this.isSelectedCompositionLoading = false;
  }

  private createCalculationRequest(
    composition: Pick<CompositionCatalogItem, 'code' | 'referenceDate'>
  ): CompositionCalculationRequest | null {
    if (!this.budget || !this.project) {
      return null;
    }

    return {
      composition_code: composition.code,
      source_file_uf: this.project.uf,
      type_system: this.budget.typeSystem,
      methodology: this.budget.methodology,
      monetary_base_date: this.normalizeDateForApi(
        this.project.monetaryBaseDate
      ),
      reference_base_date: this.normalizeDateForApi(
        composition.referenceDate
      )
    };
  }

  private calculateSectionTotals(
    response: CompositionCalculationDetailResponse
  ): CompositionSectionTotals {
    const sumLineCosts = (
      lines: Array<{ line_cost: string }>
    ): number | null => {
      let total = 0;

      for (const line of lines) {
        const lineCost = Number(line.line_cost);

        if (!Number.isFinite(lineCost)) {
          return null;
        }

        total += lineCost;
      }

      return total;
    };

    const compositionReferences =
      response.detail.composition_references;

    return {
      equipment: sumLineCosts(response.detail.equipment),
      labor: sumLineCosts(response.detail.labor),
      materials: sumLineCosts(response.detail.materials),
      auxiliaryCompositions: sumLineCosts(
        compositionReferences.filter(reference => reference.group === 'AX')
      ),
      fixedTimeCompositions: sumLineCosts(
        compositionReferences.filter(reference => reference.group === 'TF')
      )
    };
  }


  private normalizeDateForApi(
    value: string
  ): string {

    const normalizedValue =
      value.trim();


    const isoMatch =
      /^(\d{4})-(\d{2})-(\d{2})$/.exec(
        normalizedValue
      );


    if (isoMatch) {
      return normalizedValue;
    }


    const brazilianMatch =
      /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(
        normalizedValue
      );


    if (brazilianMatch) {

      return (
        `${brazilianMatch[3]}-` +
        `${brazilianMatch[2]}-` +
        `${brazilianMatch[1]}`
      );

    }


    throw new Error(
      `Data inválida: "${value}".`
    );

  }


  ngOnDestroy(): void {

    this.selectedCompositionSubscription?.unsubscribe();

    this.compositionNavigationService.clear();

  }


  get childNode(): CompositionTreeNode | null {
    const selected = this.selectedNode();

    return selected && selected.referenceType !== 'ROOT'
      ? selected
      : null;

  }

}
