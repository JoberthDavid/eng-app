import {
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  MaterialQuotation
} from '../../../models/quotation.models';



@Component({

  selector: 'app-materials-quotation-page',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './materials-quotation-page.component.html',

  styleUrl:
    './materials-quotation-page.component.scss'

})
export class MaterialsQuotationPageComponent {



  /*
   * MOCK TEMPORÁRIO
   *
   * Posteriormente será substituído
   * pelos dados vindos da API.
   *
   * Nenhum cálculo ocorre aqui.
   */


  materials: MaterialQuotation[] = [


    {

      code: 'M0028',

      material: 'Areia média',



      // =====================================================
      // TABELA 1
      // COTAÇÃO DE AQUISIÇÃO
      // =====================================================

      quotations: [

        {

          supplier: 'PEDREIRA CIPLAN',

          originState: 'GO',

          originCity: 'Goiânia',


          unitPrice: '100.0700',

          unit: 't',

          sicroUnit: 'm³',


          quotationMonth: 'maio-24',

          adjustmentIndex: 'IGP-DI',


          unitConverter: '1.50',

          sicroUnitPrice: '150.1050',


          quotationMonthIndex: '1112.26',

          baseDateIndex: '1102.57',


          adjustment: '0.99120',


          adjustedSicroUnitPrice: '148.7800'

        },


        {

          supplier: 'EXTRAÇÃO PIRINEUS',

          originState: 'GO',

          originCity: 'Pirineus',


          unitPrice: '34.0000',

          unit: 't',

          sicroUnit: 'm³',


          quotationMonth: 'junho-24',

          adjustmentIndex: 'IGP-DI',


          unitConverter: '1.50',

          sicroUnitPrice: '51.0000',


          quotationMonthIndex: '1117.79',

          baseDateIndex: '1102.57',


          adjustment: '0.98610',


          adjustedSicroUnitPrice: '50.2900'

        },


        {

          supplier: 'AREAL LEMOS',

          originState: 'GO',

          originCity: 'Goiânia',


          unitPrice: '148.0000',

          unit: 't',

          sicroUnit: 'm³',


          quotationMonth: 'junho-24',

          adjustmentIndex: 'IGP-DI',


          unitConverter: '1.50',

          sicroUnitPrice: '222.0000',


          quotationMonthIndex: '1117.79',

          baseDateIndex: '1102.57',


          adjustment: '0.98610',


          adjustedSicroUnitPrice: '220.0500'

        }

      ],




      // =====================================================
      // TABELA 2
      // TRANSPORTE
      // =====================================================

      transports: [


        {

          supplier: 'PEDREIRA CIPLAN',

          originCity: 'Goiânia',

          destination: 'Obra',


          pavedDistanceKm: '25.00',

          primaryDistanceKm: '0.00',

          naturalDistanceKm: '0.00',


          transportLnCode: '5914359',

          transportRpCode: '5914374',

          transportPvCode: '5914389',


          costLn: '0.00',

          costRp: '0.00',

          costPv: '168.63',


          totalTransport: '168.63'

        },


        {

          supplier: 'EXTRAÇÃO PIRINEUS',

          originCity: 'Pirineus',

          destination: 'Obra',


          pavedDistanceKm: '80.00',

          primaryDistanceKm: '10.00',

          naturalDistanceKm: '0.00',


          transportLnCode: '5914359',

          transportRpCode: '5914374',

          transportPvCode: '5914389',


          costLn: '0.00',

          costRp: '9.98',

          costPv: '301.46',


          totalTransport: '311.44'

        },


        {

          supplier: 'AREAL LEMOS',

          originCity: 'Goiânia',

          destination: 'Obra',


          pavedDistanceKm: '35.00',

          primaryDistanceKm: '5.00',

          naturalDistanceKm: '0.00',


          transportLnCode: '5914359',

          transportRpCode: '5914374',

          transportPvCode: '5914389',


          costLn: '0.00',

          costRp: '6.70',

          costPv: '184.80',


          totalTransport: '191.50'

        }

      ],




      // =====================================================
      // TABELA 3
      // CONSOLIDAÇÃO
      // =====================================================

      adoptedCosts: [


        {

          supplier: 'PEDREIRA CIPLAN',

          acquisitionCost: '148.7800',

          transportCost: '168.63',

          totalCost: '317.41',

          adopted: true

        },


        {

          supplier: 'EXTRAÇÃO PIRINEUS',

          acquisitionCost: '50.2900',

          transportCost: '311.44',

          totalCost: '361.73',

          adopted: false

        },


        {

          supplier: 'AREAL LEMOS',

          acquisitionCost: '220.0500',

          transportCost: '191.50',

          totalCost: '411.55',

          adopted: false

        }


      ]

    },



    {
      code: 'M0082',
      material: 'Areia média lavada',
      quotations: [],
      transports: [],
      adoptedCosts: []
    },


    {
      code: 'M0080',
      material: 'Areia fina',
      quotations: [],
      transports: [],
      adoptedCosts: []
    },


    {
      code: 'M1103',
      material: 'Pedrisco',
      quotations: [],
      transports: [],
      adoptedCosts: []
    },


    {
      code: 'M0005',
      material: 'Brita 0',
      quotations: [],
      transports: [],
      adoptedCosts: []
    },


    {
      code: 'M0191',
      material: 'Brita 1',
      quotations: [],
      transports: [],
      adoptedCosts: []
    },


    {
      code: 'M0192',
      material: 'Brita 2',
      quotations: [],
      transports: [],
      adoptedCosts: []
    },


    {
      code: 'M1135',
      material: 'Areia artificial',
      quotations: [],
      transports: [],
      adoptedCosts: []
    },


    {
      code: 'M1097',
      material: 'Pedra de mão',
      quotations: [],
      transports: [],
      adoptedCosts: []
    },


    {
      code: 'M8888350',
      material: 'BGU',
      quotations: [],
      transports: [],
      adoptedCosts: []
    }


  ];





  search = '';




  /*
   * Pesquisa geral
   */

  get filteredMaterials(): MaterialQuotation[] {


    const term =
      this.search
        .trim()
        .toLowerCase();



    if (!term) {

      return this.materials;

    }



    return this.materials.filter(

      material =>


        material.code
          .toLowerCase()
          .includes(term)



        ||

        material.material
          .toLowerCase()
          .includes(term)



        ||

        material.quotations.some(

          quotation =>

            quotation.supplier
              .toLowerCase()
              .includes(term)

        )

    );


  }





  /*
   * Formatação visual.
   *
   * Mantém string original.
   */

  formatDecimal(
    value:string
  ):string {

    return value;

  }





  /*
   * Contadores da interface
   */

  get materialCount():number {

    return this.filteredMaterials.length;

  }




  get quotationCount():number {


    return this.materials.reduce(

      (total, material) =>

        total + material.quotations.length,

      0

    );

  }




  get adoptedCount():number {


    return this.materials.reduce(

      (total, material) =>

        total +

        material.adoptedCosts.filter(
          item => item.adopted
        ).length,


      0

    );

  }



}