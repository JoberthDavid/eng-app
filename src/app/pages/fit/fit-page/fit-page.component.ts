import {
  ChangeDetectionStrategy,
  Component,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FitCalculation,
  FitStretch,
  FitUrbanCenter
} from '../../../models/fit.models';


@Component({
  selector: 'app-fit-page',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './fit-page.component.html',

  styleUrl: './fit-page.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FitPageComponent {

  /**
   * Dados provisórios para construção da interface.
   *
   * Os valores definitivos serão fornecidos pela API.
   *
   * Grandezas decimais permanecem como string.
   */
  readonly calculation = signal<FitCalculation>({

    proximityUrbanCenters: '0.15%',

    weightedVmd: '3.058',

    graphFactor: '1.78%',

    urbanCentersInterference: '0.15%',

    resultingFit: '1.93%',

    weightedFit: '1.78%',

    urbanCenters: [

      {
        city: 'São Gabriel de Goiás',
        perimeterExtensionKm: '1,5 km',
        proportion: '0,66%',
        interference: '0,03%'
      },

      {
        city: 'São João d’Aliança',
        perimeterExtensionKm: '2,8 km',
        proportion: '1,23%',
        interference: '0,06%'
      },

      {
        city: 'Alto Paraíso de Goiás',
        perimeterExtensionKm: '2,8 km',
        proportion: '1,23%',
        interference: '0,06%'
      }

    ],

    stretches: [

      {
        snv: '010BG00090',
        start: 'ENTR GO-118(A) (DIV DF/GO)',
        end: 'ENTR GO-430(A)',
        lengthKm: '5',
        vmd2019: '3006',
        vmd2024: '3485',
        stretchProportion: '2,25%',
        stretchFit: '2,48%',
        weightedFit: '0,06%'
      },

      {
        snv: '010BG00095',
        start: 'ENTR GO-430(A)',
        end: 'ENTR GO-430(B) (P/PLANALTINA)',
        lengthKm: '4',
        vmd2019: '3349',
        vmd2024: '3883',
        stretchProportion: '1,54%',
        stretchFit: '3,14%',
        weightedFit: '0,05%'
      },

      {
        snv: '010BG00110',
        start: 'ENTR GO-430(B) (P/PLANALTINA)',
        end: 'SÃO GABRIEL DE GOIÁS',
        lengthKm: '23',
        vmd2019: '3255',
        vmd2024: '3774',
        stretchProportion: '10,13%',
        stretchFit: '2,96%',
        weightedFit: '0,30%'
      },

      {
        snv: '010BG00120',
        start: 'SÃO GABRIEL DE GOIÁS',
        end: 'ENTR GO-230',
        lengthKm: '6',
        vmd2019: '3255',
        vmd2024: '3774',
        stretchProportion: '2,73%',
        stretchFit: '2,96%',
        weightedFit: '0,08%'
      },

      {
        snv: '010BG00125',
        start: 'ENTR GO-230',
        end: 'ENTR GO-237',
        lengthKm: '29',
        vmd2019: '2539',
        vmd2024: '2944',
        stretchProportion: '12,60%',
        stretchFit: '1,57%',
        weightedFit: '0,20%'
      },

      {
        snv: '010BG00130',
        start: 'ENTR GO-237',
        end: 'INÍCIO PERÍMETRO URB SÃO JOÃO D’ALIANÇA',
        lengthKm: '26',
        vmd2019: '2540',
        vmd2024: '2945',
        stretchProportion: '11,50%',
        stretchFit: '1,58%',
        weightedFit: '0,18%'
      },

      {
        snv: '010BG00135',
        start: 'INÍCIO PERÍMETRO URB SÃO JOÃO D’ALIANÇA',
        end: 'FIM PERÍMETRO URB SÃO JOÃO D’ALIANÇA',
        lengthKm: '2',
        vmd2019: '2540',
        vmd2024: '2945',
        stretchProportion: '0,71%',
        stretchFit: '1,58%',
        weightedFit: '0,01%'
      },

      {
        snv: '010BG00140',
        start: 'FIM PERÍMETRO URB SÃO JOÃO D’ALIANÇA',
        end: 'ENTR GO-236',
        lengthKm: '11',
        vmd2019: '2918',
        vmd2024: '3383',
        stretchProportion: '5,02%',
        stretchFit: '2,31%',
        weightedFit: '0,12%'
      },

      {
        snv: '010BG00150',
        start: 'ENTR GO-236',
        end: 'ENTR GO-239(A) (ALTO PARAÍSO DE GOIÁS)',
        lengthKm: '55',
        vmd2019: '2546',
        vmd2024: '2952',
        stretchProportion: '24,41%',
        stretchFit: '1,59%',
        weightedFit: '0,39%'
      },

      {
        snv: '010BG00160',
        start: 'ENTR GO-239(A) (ALTO PARAÍSO DE GOIÁS)',
        end: 'ENTR GO-239(B) (ALTO PARAÍSO DE GOIÁS)',
        lengthKm: '1',
        vmd2019: '2412',
        vmd2024: '2796',
        stretchProportion: '0,44%',
        stretchFit: '1,33%',
        weightedFit: '0,01%'
      },

      {
        snv: '010BG00170',
        start: 'ENTR GO-239(B) (ALTO PARAÍSO DE GOIÁS)',
        end: 'ENTR GO-118(B)/241 (TERESINA DE GOIÁS)',
        lengthKm: '65',
        vmd2019: '2412',
        vmd2024: '2796',
        stretchProportion: '28,68%',
        stretchFit: '1,33%',
        weightedFit: '0,38%'
      }

    ]

  });


  readonly urbanCenters = this.calculation().urbanCenters;

  readonly stretches = this.calculation().stretches;


  trackUrbanCenter(
    index: number,
    center: FitUrbanCenter
  ): string {
    return `${center.city}-${index}`;
  }


  trackStretch(
    index: number,
    stretch: FitStretch
  ): string {
    return `${stretch.snv}-${index}`;
  }

}