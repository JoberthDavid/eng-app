import { Injectable, inject } from '@angular/core';

import { ProjectService } from './project.service';
import { AbcCompositionResult } from '../models/abc.models';

@Injectable({
  providedIn: 'root'
})
export class AbcCompositionService {

  private readonly projectService = inject(ProjectService);

  /*
   * Adaptador temporário para o contrato que futuramente será
   * fornecido pela API Python.
   *
   * O Angular não calcula a Curva ABC.
   *
   * Percentuais, acumulados e classificações representam
   * dados que futuramente serão retornados pela API.
   */
  getByBudgetId(
    budgetId: string
  ): AbcCompositionResult | null {

    const budget =
      this.projectService.getBudgetById(budgetId);

    if (!budget) {
      return null;
    }

    /*
     * Dados atualmente existentes no projeto.
     *
     * Este bloco será substituído pela chamada HTTP
     * para a API Python.
     */
    if (budget.id === 'BUD-002') {

      return {

        budgetId: budget.id,

        referenceDate:
          budget.referenceDate,

        totalCost:
          '195,40',

        compositionCount:
          '2',

        classACount:
          '2',

        classBCount:
          '0',

        classCCount:
          '0',

        classAParticipation:
          '100,00%',

        classBParticipation:
          '0,00%',

        classCParticipation:
          '0,00%',

        items: [

          {
            code: 'COMP-001',

            description:
              'Composição X',

            unit:
              'm²',

            quantity:
              '1250',

            factor:
              '1',

            unitCost:
              'R$ 125,40',

            totalCost:
              'R$ 125,40',

            participation:
              '64,18%',

            accumulatedParticipation:
              '64,18%',

            classification:
              'A'
          },

          {
            code: 'COMP-002',

            description:
              'Composição X',

            unit:
              'm²',

            quantity:
              '1250',

            factor:
              '0,35',

            unitCost:
              'R$ 200,00',

            totalCost:
              'R$ 70,00',

            participation:
              '35,82%',

            accumulatedParticipation:
              '100,00%',

            classification:
              'A'
          }

        ]
      };
    }

    /*
     * Orçamento existente, mas ainda sem resultado ABC
     * fornecido pelo adaptador/API.
     */
    return {

      budgetId:
        budget.id,

      referenceDate:
        budget.referenceDate,

      totalCost:
        '0,00',

      compositionCount:
        '0',

      classACount:
        '0',

      classBCount:
        '0',

      classCCount:
        '0',

      classAParticipation:
        '0,00%',

      classBParticipation:
        '0,00%',

      classCParticipation:
        '0,00%',

      items: []
    };
  }
}