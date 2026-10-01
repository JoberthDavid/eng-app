import {
  Component,
  inject
} from '@angular/core';


import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';


import {
  AbcCompositionItem,
  AbcCompositionResult,
  AbcCurvePoint,
  AbcEquipmentItem,
  AbcEquipmentResult,
  AbcLaborItem,
  AbcLaborResult,
  AbcMaterialItem,
  AbcMaterialResult,
  AbcSummary,
  AbcTab
} from '../../../models/abc.models';


import {
  AbcService
} from '../../../services/abc-composition.service';


@Component({
  selector:
    'app-abc-compositions-page',

  standalone:
    true,

  imports: [
    RouterLink
  ],

  templateUrl:
    './abc-compositions-page.component.html',

  styleUrl:
    './abc-compositions-page.component.scss'
})
export class AbcCompositionsPageComponent {


  private readonly route =
    inject(ActivatedRoute);


  private readonly abcService =
    inject(AbcService);


  // ==========================================================
  // ESTADO
  // ==========================================================

  selectedTab:
    AbcTab =
      'COMPOSITIONS';


  readonly budgetId:
    string | null;


  // ==========================================================
  // RESULTADOS
  // ==========================================================

  readonly compositions:
    AbcCompositionResult | null;


  readonly materials:
    AbcMaterialResult | null;


  readonly equipment:
    AbcEquipmentResult | null;


  readonly labor:
    AbcLaborResult | null;


  constructor() {

    this.budgetId =
      this.route.snapshot.paramMap
        .get('budgetId');


    this.compositions =
      this.budgetId

        ? this.abcService
            .getCompositions(
              this.budgetId
            )

        : null;


    this.materials =
      this.budgetId

        ? this.abcService
            .getMaterials(
              this.budgetId
            )

        : null;


    this.equipment =
      this.budgetId

        ? this.abcService
            .getEquipment(
              this.budgetId
            )

        : null;


    this.labor =
      this.budgetId

        ? this.abcService
            .getLabor(
              this.budgetId
            )

        : null;

  }


  // ==========================================================
  // ABAS
  // ==========================================================

  selectTab(
    tab: AbcTab
  ): void {

    this.selectedTab = tab;

  }


  isTab(
    tab: AbcTab
  ): boolean {

    return (
      this.selectedTab === tab
    );

  }


  get tabLabel(): string {

    switch (
      this.selectedTab
    ) {

      case 'COMPOSITIONS':
        return 'Composições';

      case 'MATERIALS':
        return 'Materiais';

      case 'EQUIPMENT':
        return 'Equipamentos';

      case 'LABOR':
        return 'Mão de obra';

    }

  }


  // ==========================================================
  // RESUMO
  // ==========================================================

  get currentSummary():
    AbcSummary | null {

    switch (
      this.selectedTab
    ) {

      case 'COMPOSITIONS':

        if (!this.compositions) {
          return null;
        }

        return {

          totalCost:
            this.compositions.totalCost,

          itemCount:
            this.compositions.compositionCount,

          classACount:
            this.compositions.classACount,

          classBCount:
            this.compositions.classBCount,

          classCCount:
            this.compositions.classCCount,

          classAParticipation:
            this.compositions.classAParticipation,

          classBParticipation:
            this.compositions.classBParticipation,

          classCParticipation:
            this.compositions.classCParticipation

        };


      case 'MATERIALS':

        return this.materials?.summary
          ?? null;


      case 'EQUIPMENT':

        return this.equipment?.summary
          ?? null;


      case 'LABOR':

        return this.labor?.summary
          ?? null;

    }

  }


  get showClassSummary(): boolean {

    return (
      this.currentSummary?.classACount
      !== undefined
    );

  }


  // ==========================================================
  // CURVA
  // ==========================================================

  get curvePoints():
    AbcCurvePoint[] {

    switch (
      this.selectedTab
    ) {

      case 'COMPOSITIONS':

        return (
          this.compositions?.items
            .map(
              item => ({
                code:
                  item.code,

                description:
                  item.description,

                accumulatedParticipation:
                  item.accumulatedParticipation
              })
            )
          ?? []
        );


      case 'MATERIALS':

        return (
          this.materials?.items
            .map(
              item => ({
                code:
                  item.code,

                description:
                  item.description,

                accumulatedParticipation:
                  item.accumulatedParticipation
              })
            )
          ?? []
        );


      case 'EQUIPMENT':

        return (
          this.equipment?.items
            .map(
              item => ({
                code:
                  item.code,

                description:
                  item.description,

                accumulatedParticipation:
                  item.accumulatedParticipation
              })
            )
          ?? []
        );


      case 'LABOR':

        return (
          this.labor?.items
            .map(
              item => ({
                code:
                  item.code,

                description:
                  item.description,

                accumulatedParticipation:
                  item.accumulatedParticipation
              })
            )
          ?? []
        );

    }

  }


  // ==========================================================
  // VALIDAÇÃO
  // ==========================================================

  get hasResult(): boolean {

    switch (
      this.selectedTab
    ) {

      case 'COMPOSITIONS':
        return this.compositions !== null;

      case 'MATERIALS':
        return this.materials !== null;

      case 'EQUIPMENT':
        return this.equipment !== null;

      case 'LABOR':
        return this.labor !== null;

    }

  }


  // ==========================================================
  // TRACK
  // ==========================================================

  trackComposition(
    _index: number,
    item: AbcCompositionItem
  ): string {

    return item.code;

  }


  trackMaterial(
    _index: number,
    item: AbcMaterialItem
  ): string {

    return item.code;

  }


  trackEquipment(
    _index: number,
    item: AbcEquipmentItem
  ): string {

    return item.code;

  }


  trackLabor(
    _index: number,
    item: AbcLaborItem
  ): string {

    return item.code;

  }

}