import {
  Injectable
} from '@angular/core';

import {
  TimelineMonth,
  TimelineResult
} from '../models/timeline.models';


@Injectable({
  providedIn: 'root'
})
export class TimelineService {


  // ==========================================================
  // Timeline DE DEMONSTRAÇÃO
  //
  // Estes dados representam o contrato da interface.
  //
  // Posteriormente serão substituídos pela API Python.
  // Nenhuma regra de cálculo deve ser adicionada aqui.
  // ==========================================================

  private readonly Timeline: TimelineResult = {

    budgetId: 'BUD-002',

    referenceDate: '01/06/2026',

    contractTermMonths: '24',

    startDate: '01/01/2027',

    months: this.createMonths(),

    rows: [

      {
        code: '01',
        description: 'Conservação rotineira',
        unit: '—',
        quantity: '—',
        totalCost: 'R$ 499.412,17',
        type: 'GROUP',
        parentCode: null,

        monthlyPercentages: [
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%'
        ],

        monthlyValues: [
          'R$ 20.808,84', 'R$ 20.808,84',
          'R$ 20.808,84', 'R$ 20.808,84',
          'R$ 20.808,84', 'R$ 20.808,84',
          'R$ 20.808,84', 'R$ 20.808,84',
          'R$ 20.808,84', 'R$ 20.808,84',
          'R$ 20.808,84', 'R$ 20.808,84',
          'R$ 20.808,84', 'R$ 20.808,84',
          'R$ 20.808,84', 'R$ 20.808,84',
          'R$ 20.808,84', 'R$ 20.808,84',
          'R$ 20.808,84', 'R$ 20.808,84',
          'R$ 20.808,84', 'R$ 20.808,84',
          'R$ 20.808,84', 'R$ 20.808,85'
        ]
      },


      {
        code: '02',
        description: 'Conservação periódica',
        unit: '—',
        quantity: '—',
        totalCost: 'R$ 312.132,61',
        type: 'GROUP',
        parentCode: null,

        monthlyPercentages: [
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%'
        ],

        monthlyValues: [
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,42'
        ]
      },


      {
        code: '04',
        description: 'Conservação de emergência',
        unit: '—',
        quantity: '—',
        totalCost: 'R$ 124.853,04',
        type: 'GROUP',
        parentCode: null,

        monthlyPercentages: [
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%'
        ],

        monthlyValues: [
          'R$ 5.202,21', 'R$ 5.202,21',
          'R$ 5.202,21', 'R$ 5.202,21',
          'R$ 5.202,21', 'R$ 5.202,21',
          'R$ 5.202,21', 'R$ 5.202,21',
          'R$ 5.202,21', 'R$ 5.202,21',
          'R$ 5.202,21', 'R$ 5.202,21',
          'R$ 5.202,21', 'R$ 5.202,21',
          'R$ 5.202,21', 'R$ 5.202,21',
          'R$ 5.202,21', 'R$ 5.202,21',
          'R$ 5.202,21', 'R$ 5.202,21',
          'R$ 5.202,21', 'R$ 5.202,21',
          'R$ 5.202,21', 'R$ 5.202,21'
        ]
      },


      {
        code: '08',
        description: 'Transportes',
        unit: '—',
        quantity: '—',
        totalCost: 'R$ 312.132,60',
        type: 'GROUP',
        parentCode: null,

        monthlyPercentages: [
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%',
          '4,1667%', '4,1667%', '4,1667%', '4,1667%'
        ],

        monthlyValues: [
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,53',
          'R$ 13.005,53', 'R$ 13.005,41'
        ]
      }

    ],

    summary: {

      totalCost:
        'R$ 1.248.530,42',

      contractTermMonths:
        '24',

      startDate:
        '01/01/2027',

      monthlyAverage:
        'R$ 52.022,10'
    }

  };


  getTimeline(
    budgetId: string
  ): TimelineResult | null {

    if (
      budgetId !== this.Timeline.budgetId
    ) {
      return null;
    }

    return {
      ...this.Timeline,
      months: [
        ...this.Timeline.months
      ],
      rows: [
        ...this.Timeline.rows
      ]
    };
  }


  requestReport(
    budgetId: string
  ): void {

    console.info(
      'Solicitação de relatório de Timeline:',
      budgetId
    );

  }


  private createMonths():
    TimelineMonth[] {

    return [

      {
        number: '1',
        label: 'JAN/27',
        year: '2027'
      },

      {
        number: '2',
        label: 'FEV/27',
        year: '2027'
      },

      {
        number: '3',
        label: 'MAR/27',
        year: '2027'
      },

      {
        number: '4',
        label: 'ABR/27',
        year: '2027'
      },

      {
        number: '5',
        label: 'MAI/27',
        year: '2027'
      },

      {
        number: '6',
        label: 'JUN/27',
        year: '2027'
      },

      {
        number: '7',
        label: 'JUL/27',
        year: '2027'
      },

      {
        number: '8',
        label: 'AGO/27',
        year: '2027'
      },

      {
        number: '9',
        label: 'SET/27',
        year: '2027'
      },

      {
        number: '10',
        label: 'OUT/27',
        year: '2027'
      },

      {
        number: '11',
        label: 'NOV/27',
        year: '2027'
      },

      {
        number: '12',
        label: 'DEZ/27',
        year: '2027'
      },

      {
        number: '13',
        label: 'JAN/28',
        year: '2028'
      },

      {
        number: '14',
        label: 'FEV/28',
        year: '2028'
      },

      {
        number: '15',
        label: 'MAR/28',
        year: '2028'
      },

      {
        number: '16',
        label: 'ABR/28',
        year: '2028'
      },

      {
        number: '17',
        label: 'MAI/28',
        year: '2028'
      },

      {
        number: '18',
        label: 'JUN/28',
        year: '2028'
      },

      {
        number: '19',
        label: 'JUL/28',
        year: '2028'
      },

      {
        number: '20',
        label: 'AGO/28',
        year: '2028'
      },

      {
        number: '21',
        label: 'SET/28',
        year: '2028'
      },

      {
        number: '22',
        label: 'OUT/28',
        year: '2028'
      },

      {
        number: '23',
        label: 'NOV/28',
        year: '2028'
      },

      {
        number: '24',
        label: 'DEZ/28',
        year: '2028'
      }

    ];

  }

}