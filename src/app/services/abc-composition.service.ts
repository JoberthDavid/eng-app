import {
  Injectable,
  inject
} from '@angular/core';


import {
  AbcCompositionResult,
  AbcEquipmentResult,
  AbcLaborResult,
  AbcMaterialResult
} from '../models/abc.models';


import {
  ProjectService
} from './project.service';


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


@Injectable({
  providedIn: 'root'
})
export class AbcService {


  private readonly projectService =
    inject(ProjectService);


  private readonly compositionService =
    inject(AbcCompositionService);


  // ==========================================================
  // COMPOSIÇÕES
  // ==========================================================

  getCompositions(
    budgetId: string
  ):
    AbcCompositionResult | null {

    return this.compositionService
      .getByBudgetId(
        budgetId
      );

  }


  // ==========================================================
  // MATERIAIS
  //
  // Dados provisórios para construção da interface.
  // O cálculo definitivo virá da API Python.
  // ==========================================================

  getMaterials(
    budgetId: string
  ):
    AbcMaterialResult | null {

    const budget =
      this.projectService.getBudgetById(
        budgetId
      );


    if (!budget) {

      return null;

    }


    return {

      budgetId:
        budget.id,

      referenceDate:
        budget.referenceDate,

      summary: {

        totalCost:
          '—',

        itemCount:
          '10'

      },

      items: [

        {
          item: '1',
          code: 'ANP1950',
          description:
            'Emulsão com polímero para microrrevestimento a frio (ANP)',
          quantity: '1.351,7986',
          totalCost: '5.487.042,00',
          participation: '31,663%',
          accumulatedParticipation: '31,663%',
          classification: 'A'
        },

        {
          item: '2',
          code: 'ANP1943-0',
          description:
            'Cimento asfáltico CAP 30/45 (ANP)',
          quantity: '1.101,3704',
          totalCost: '4.413.851,93',
          participation: '25,470%',
          accumulatedParticipation: '57,133%',
          classification: 'A'
        },

        {
          item: '3',
          code: 'M1941',
          description:
            'Óleo tipo 1',
          quantity: '163.403,3146',
          totalCost: '1.002.463,31',
          participation: '5,785%',
          accumulatedParticipation: '62,918%',
          classification: 'A'
        },

        {
          item: '4',
          code: 'DNIT1943-0',
          description:
            'Transporte cimento asfáltico CAP 30/45 (DNIT)',
          quantity: '1.101,3704',
          totalCost: '685.216,58',
          participation: '3,954%',
          accumulatedParticipation: '66,872%',
          classification: 'A'
        },

        {
          item: '5',
          code: 'DNIT1950',
          description:
            'Transporte emulsão com polímero para microrrevestimento a frio (DNIT)',
          quantity: '1.351,7986',
          totalCost: '567.526,28',
          participation: '3,275%',
          accumulatedParticipation: '70,146%',
          classification: 'A'
        },

        {
          item: '6',
          code: 'M0028',
          description:
            'Areia média',
          quantity: '6.835,1533',
          totalCost: '480.770,20',
          participation: '2,774%',
          accumulatedParticipation: '72,921%',
          classification: 'A'
        },

        {
          item: '7',
          code: 'M0344',
          description:
            'Cal hidratada - a granel',
          quantity: '1.147.908,2848',
          totalCost: '465.705,45',
          participation: '2,687%',
          accumulatedParticipation: '75,608%',
          classification: 'A'
        },

        {
          item: '8',
          code: 'M1135',
          description:
            'Pó de pedra',
          quantity: '6.315,0759',
          totalCost: '429.654,28',
          participation: '2,479%',
          accumulatedParticipation: '78,087%',
          classification: 'A'
        },

        {
          item: '9',
          code: 'M8888350',
          description:
            'CBUQ faixa C comercial (usina e materiais exceto CAP)',
          quantity: '1.783,8500',
          totalCost: '386.346,23',
          participation: '2,229%',
          accumulatedParticipation: '80,316%',
          classification: 'B'
        },

        {
          item: '10',
          code: 'ANP1943-1',
          description:
            'Cimento asfáltico CAP 50/70 (ANP)',
          quantity: '90,9764',
          totalCost: '380.706,06',
          participation: '2,197%',
          accumulatedParticipation: '82,514%',
          classification: 'B'
        }

      ]

    };

  }


  // ==========================================================
  // EQUIPAMENTOS
  // ==========================================================

  getEquipment(
    budgetId: string
  ):
    AbcEquipmentResult | null {

    const budget =
      this.projectService.getBudgetById(
        budgetId
      );


    if (!budget) {

      return null;

    }


    return {

      budgetId:
        budget.id,

      referenceDate:
        budget.referenceDate,

      summary: {

        totalCost:
          '—',

        itemCount:
          '10'

      },

      items: [

        {
          item: '1',
          code: 'E9579',
          description:
            'Caminhão basculante com capacidade de 10 m³ - 188 kW',
          productiveQuantity: '15.709,6623',
          unproductiveQuantity: '410,7036',
          totalHours: '16.120,3659',
          totalCost: '4.560.617,56',
          participation: '49,147%',
          accumulatedParticipation: '49,147%',
          classification: 'A'
        },

        {
          item: '2',
          code: 'E9670',
          description:
            'Usina móvel de lama asfáltica ou microrrevestimento',
          productiveQuantity: '871,7016',
          unproductiveQuantity: '0,0000',
          totalHours: '871,7016',
          totalCost: '653.922,66',
          participation: '7,047%',
          accumulatedParticipation: '56,194%',
          classification: 'A'
        },

        {
          item: '3',
          code: 'E9134',
          description:
            'Minicarregadeira para composição',
          productiveQuantity: '1.108,8000',
          unproductiveQuantity: '4.435,2000',
          totalHours: '5.544,0000',
          totalCost: '548.467,92',
          participation: '5,953%',
          accumulatedParticipation: '62,105%',
          classification: 'A'
        },

        {
          item: '4',
          code: 'E9690',
          description:
            'Caminhão carroceria com guindauto e cesto aéreo',
          productiveQuantity: '1.338,0210',
          unproductiveQuantity: '0,0000',
          totalHours: '1.338,0210',
          totalCost: '446.958,28',
          participation: '4,817%',
          accumulatedParticipation: '66,922%',
          classification: 'A'
        },

        {
          item: '5',
          code: 'E9475',
          description:
            'Trator agrícola sobre pneus com roçadeira',
          productiveQuantity: '2.288,9292',
          unproductiveQuantity: '0,0000',
          totalHours: '2.288,9292',
          totalCost: '333.600,06',
          participation: '3,595%',
          accumulatedParticipation: '70,517%',
          classification: 'A'
        },

        {
          item: '6',
          code: 'E9125',
          description:
            'Veículo tipo van furgão com capacidade de 1,54 t',
          productiveQuantity: '113,9407',
          unproductiveQuantity: '4.435,2000',
          totalHours: '5.549,1407',
          totalCost: '292.415,77',
          participation: '3,151%',
          accumulatedParticipation: '73,668%',
          classification: 'A'
        },

        {
          item: '7',
          code: 'E9689',
          description:
            'Usina de asfalto a quente gravimétrica',
          productiveQuantity: '205,0744',
          unproductiveQuantity: '0,0000',
          totalHours: '205,0744',
          totalCost: '253.559,49',
          participation: '2,733%',
          accumulatedParticipation: '76,400%',
          classification: 'A'
        },

        {
          item: '8',
          code: 'E9506',
          description:
            'Caminhão basculante com capacidade de 6 m³',
          productiveQuantity: '1.045,8299',
          unproductiveQuantity: '21,4879',
          totalHours: '1.067,3178',
          totalCost: '195.985,06',
          participation: '2,112%',
          accumulatedParticipation: '78,512%',
          classification: 'A'
        },

        {
          item: '9',
          code: 'E9584',
          description:
            'Carregadeira de pneus com capacidade de 1,72 m³',
          productiveQuantity: '344,2687',
          unproductiveQuantity: '1.254,1240',
          totalHours: '1.598,3927',
          totalCost: '194.626,03',
          participation: '2,097%',
          accumulatedParticipation: '80,610%',
          classification: 'B'
        },

        {
          item: '10',
          code: 'E9783',
          description:
            'Fresadora a frio - 455 kW',
          productiveQuantity: '129,6205',
          unproductiveQuantity: '0,0000',
          totalHours: '129,6205',
          totalCost: '181.307,01',
          participation: '1,954%',
          accumulatedParticipation: '82,564%',
          classification: 'B'
        }

      ]

    };

  }


  // ==========================================================
  // MÃO DE OBRA
  // ==========================================================

  getLabor(
    budgetId: string
  ):
    AbcLaborResult | null {

    const budget =
      this.projectService.getBudgetById(
        budgetId
      );


    if (!budget) {

      return null;

    }


    return {

      budgetId:
        budget.id,

      referenceDate:
        budget.referenceDate,

      summary: {

        totalCost:
          '—',

        itemCount:
          '10'

      },

      items: [

        {
          item: '1',
          code: 'P9824',
          description: 'Servente',
          quantity: '102.004,3357',
          totalCost: '2.079.271,72',
          participation: '56,047%',
          accumulatedParticipation: '56,047%',
          classification: 'A'
        },

        {
          item: '2',
          code: 'P9804',
          description: 'Apontador',
          quantity: '50,4000',
          totalCost: '248.315,74',
          participation: '6,693%',
          accumulatedParticipation: '62,740%',
          classification: 'A'
        },

        {
          item: '3',
          code: 'P9833',
          description: 'Auxiliar de laboratório',
          quantity: '50,4000',
          totalCost: '221.716,26',
          participation: '5,976%',
          accumulatedParticipation: '68,717%',
          classification: 'A'
        },

        {
          item: '4',
          code: 'P9916',
          description: 'Encarregado de conservação rodoviária',
          quantity: '25,2000',
          totalCost: '203.965,56',
          participation: '5,498%',
          accumulatedParticipation: '74,215%',
          classification: 'A'
        },

        {
          item: '5',
          code: 'P9858',
          description: 'Laboratorista',
          quantity: '25,2000',
          totalCost: '149.856,19',
          participation: '4,039%',
          accumulatedParticipation: '78,254%',
          classification: 'A'
        },

        {
          item: '6',
          code: 'P9918',
          description: 'Engenheiro supervisor',
          quantity: '6,3000',
          totalCost: '143.454,08',
          participation: '3,867%',
          accumulatedParticipation: '82,121%',
          classification: 'B'
        },

        {
          item: '7',
          code: 'P9827',
          description: 'Vigia',
          quantity: '25,2000',
          totalCost: '114.178,61',
          participation: '3,078%',
          accumulatedParticipation: '85,199%',
          classification: 'B'
        },

        {
          item: '8',
          code: 'P9806',
          description: 'Auxiliar administrativo',
          quantity: '25,2000',
          totalCost: '108.770,46',
          participation: '2,932%',
          accumulatedParticipation: '88,131%',
          classification: 'B'
        },

        {
          item: '9',
          code: 'P9886',
          description: 'Porteiro',
          quantity: '25,2000',
          totalCost: '106.888,36',
          participation: '2,881%',
          accumulatedParticipation: '91,012%',
          classification: 'B'
        },

        {
          item: '10',
          code: 'P9842',
          description: 'Faxineiro',
          quantity: '25,2000',
          totalCost: '94.840,78',
          participation: '2,556%',
          accumulatedParticipation: '93,568%',
          classification: 'B'
        }

      ]

    };

  }

}