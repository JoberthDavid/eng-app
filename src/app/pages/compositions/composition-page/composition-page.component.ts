import {
  Component,
  OnDestroy,
  inject
} from '@angular/core';

import {
  ActivatedRoute
} from '@angular/router';

import {
  CompositionCalculationDetailResponse
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
  CompositionPanelComponent
} from '../../../components/composition-panel/composition-panel.component';


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


  compositionTree =
    this.compositionCode
      ? this.compositionTreeService.buildTree(
          this.compositionCode,
          this.composition
        )
      : null;


  calculation:
    CompositionCalculationDetailResponse | null = null;


  isCalculating = false;


  calculationError: string | null = null;


  constructor() {

    this.compositionNavigationService.setActiveTree(
      this.compositionTree
    );


    this.calculateComposition();

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

    const request = {

      composition_code:
        composition.code,

      source_file_uf:
        this.project.uf,

      type_system:
        this.budget.typeSystem,

      methodology:
        this.budget.methodology,

      monetary_base_date:
        this.normalizeDateForApi(
          this.project.monetaryBaseDate
        ),

      reference_base_date:
        this.normalizeDateForApi(
          composition.referenceDate
        )

    };


    this.isCalculating = true;

    this.calculationError = null;


    this.compositionService
      .calculateDetail(request)
      .subscribe({

          next: response => {

            this.calculation =
              response;

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

    this.compositionNavigationService.clear();

  }


  get isChildSelection(): boolean {

    const selected =
      this.selectedNode();


    return (
      selected !== null &&
      selected.referenceType !== 'ROOT'
    );

  }


  get parentNode(): CompositionTreeNode | null {

    const tree =
      this.compositionTree;


    const selected =
      this.selectedNode();


    if (!tree || !selected) {
      return null;
    }


    return this.compositionTreeService.findParent(
      tree,
      selected.composition.code
    );

  }


  get childNode(): CompositionTreeNode | null {

    return this.selectedNode();

  }

}