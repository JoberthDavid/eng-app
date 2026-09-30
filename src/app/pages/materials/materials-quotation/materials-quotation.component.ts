import {
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import { MaterialQuotation, MaterialSupplierQuotation } from '../../../models/quotation.models';


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
   * pelo backend.
   */

  materials: MaterialQuotation[] = [

    {
      code: 'M0028',

      material: 'Areia média',

      quotations: [

        {
          supplier: 'PEDREIRA CIPLAN',

          unitPrice: 100.0700,

          unit: 't',

          sicroUnit: 'm³',

          quotationMonth: 'maio-24',

          adjustmentIndex: 'IGP-DI',

          unitConverter: 1.50,

          sicroUnitPrice: 150.1050,

          quotationMonthIndex: 1112.26,

          baseDateIndex: 1102.57,

          adjustment: 0.99120,

          adjustedSicroUnitPrice: 148.7800,

          transportLnCode: '5914359',

          transportRpCode: '5914374',

          transportPvCode: '5914389',

          costLn: 0,

          costRp: 0,

          costPv: 168.63,

          totalCost: 317.41,

          adopted: false,

          transportType: 'FOB'
        },

        {
          supplier: 'EXTRAÇÃO PIRINEUS',

          unitPrice: 34.0000,

          unit: 't',

          sicroUnit: 'm³',

          quotationMonth: 'junho-24',

          adjustmentIndex: 'IGP-DI',

          unitConverter: 1.50,

          sicroUnitPrice: 51.0000,

          quotationMonthIndex: 1117.79,

          baseDateIndex: 1102.57,

          adjustment: 0.98610,

          adjustedSicroUnitPrice: 50.2900,

          transportLnCode: '5914359',

          transportRpCode: '5914374',

          transportPvCode: '5914389',

          costLn: 0,

          costRp: 9.98,

          costPv: 301.46,

          totalCost: 361.73,

          adopted: false,

          transportType: 'FOB'
        },

        {
          supplier: 'AREAL LEMOS',

          unitPrice: 148.0000,

          unit: 't',

          sicroUnit: 'm³',

          quotationMonth: 'junho-24',

          adjustmentIndex: 'IGP-DI',

          unitConverter: 1.50,

          sicroUnitPrice: 222.0000,

          quotationMonthIndex: 1117.79,

          baseDateIndex: 1102.57,

          adjustment: 0.98610,

          adjustedSicroUnitPrice: 220.0500,

          transportLnCode: '5914359',

          transportRpCode: '5914374',

          transportPvCode: '5914389',

          costLn: 0,

          costRp: 6.70,

          costPv: 184.80,

          totalCost: 404.85,

          adopted: false,

          transportType: 'FOB'
        }

      ]
    },

    {
      code: 'M0082',

      material: 'Areia média lavada',

      quotations: []

    },

    {
      code: 'M0080',

      material: 'Areia fina',

      quotations: []

    },

    {
      code: 'M1103',

      material: 'Pedrisco',

      quotations: []

    },

    {
      code: 'M0005',

      material: 'Brita 0',

      quotations: []

    },

    {
      code: 'M0191',

      material: 'Brita 1',

      quotations: []

    },

    {
      code: 'M0192',

      material: 'Brita 2',

      quotations: []

    },

    {
      code: 'M1135',

      material: 'Areia artificial',

      quotations: []

    },

    {
      code: 'M1097',

      material: 'Pedra de mão',

      quotations: []

    },

    {
      code: 'M8888350',

      material: 'BGU',
      
      quotations: []

    }

  ];


  /*
   * Filtro
   */

  search = '';


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


  formatNumber(
    value: number,
    digits = 2
  ): string {

    return value.toLocaleString(
      'pt-BR',
      {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      }
    );

  }


  get adoptedQuotationCount(): number {

    return this.materials
      .reduce(
        (count, material) =>

          count +
          material.quotations.filter(
            quotation =>
              quotation.adopted
          ).length,

        0
      );

  }

}