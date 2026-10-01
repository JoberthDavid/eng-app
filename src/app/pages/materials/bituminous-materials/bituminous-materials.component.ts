import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  BituminousMaterial,
  BituminousOrigin
} from '../../../models/bituminous-material.models';

interface BituminousMaterialRow {
  code: string;
  material: string;

  /**
   * Valores decimais provenientes da API.
   * Permanecem como string para preservar precisão.
   */
  icms: string;

  state: string;
  origin: string;

  values: string[];

  adopted: boolean;
}

@Component({
  selector: 'app-bituminous-materials',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './bituminous-materials-page.component.html',
  styleUrl: './bituminous-materials-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BituminousMaterialsComponent {

  readonly search = signal('');

  /**
   * Dados provisórios exclusivamente para construção da interface.
   *
   * IMPORTANTE:
   * - valores decimais permanecem como string;
   * - nenhum cálculo de negócio é realizado no frontend;
   * - os dados definitivos serão fornecidos pela API.
   */
  readonly rows = signal<BituminousMaterialRow[]>([
    {
      code: 'M0104',
      material: 'Asfalto diluído CM 30',
      icms: '19.000000',
      state: 'BA',
      origin: 'Distribuidora de Asfalto / Refinaria - Candeias/BA',
      values: [
        '4395.16381',
        '4395.16381',
        '4561.66457',
        '6476.43',
        '1344',
        '0',
        '0',
        '761.84',
        '0',
        '761.84',
        '1081.62',
        '7558.05'
      ],
      adopted: false
    },

    {
      code: 'M0104',
      material: 'Asfalto diluído CM 30',
      icms: '19.000000',
      state: 'CE',
      origin: 'Distribuidora de Asfalto / Refinaria - Maracanaú/CE',
      values: [
        '4888.12695',
        '4888.12695',
        '5073.30249',
        '7202.83',
        '100',
        '0',
        '0',
        '139.96',
        '0',
        '139.96',
        '191.70',
        '7401.53'
      ],
      adopted: false
    },

    {
      code: 'M0104',
      material: 'Asfalto diluído CM 30',
      icms: '19.000000',
      state: 'GO',
      origin: 'Distribuidora de Asfalto / Refinaria - Aparecida de Goiânia/GO',
      values: [
        '4142.47353',
        '4142.47353',
        '4289.00484',
        '6104.68',
        '371',
        '0',
        '0',
        '290.78',
        '0',
        '290.78',
        '356.04',
        '6460.72'
      ],
      adopted: true
    },

    {
      code: 'M1946',
      material: 'Emulsão asfáltica RR-1C',
      icms: '19.000000',
      state: 'BA',
      origin: 'Distribuidora de Asfalto / Refinaria - Candeias/BA',
      values: [
        '5112.91393',
        '5112.91393',
        '5305.63377',
        '7534.00',
        '1211',
        '0',
        '0',
        '633.93',
        '0',
        '633.93',
        '793.49',
        '8311.02'
      ],
      adopted: false
    },

    {
      code: 'M1947',
      material: 'Emulsão asfáltica RM-1C',
      icms: '19.000000',
      state: 'GO',
      origin: 'Distribuidora de Asfalto / Refinaria - Aparecida de Goiânia/GO',
      values: [
        '3040.43309',
        '3040.43309',
        '3154.78338',
        '4482.68',
        '371',
        '0',
        '0',
        '250.78',
        '0',
        '250.78',
        '356.04',
        '4838.72'
      ],
      adopted: true
    },

    {
      code: 'M1950',
      material: 'Emulsão com polímero para micro revestimento a frio',
      icms: '19.000000',
      state: 'GO',
      origin: 'Distribuidora de Asfalto / Refinaria - Aparecida de Goiânia/GO',
      values: [
        '3300.41017',
        '3300.41017',
        '3424.77902',
        '4870.18',
        '371',
        '0',
        '0',
        '250.78',
        '0',
        '250.78',
        '356.04',
        '5226.22'
      ],
      adopted: true
    },

    {
      code: 'M2097',
      material: 'Emulsão asfáltica RR-2C',
      icms: '19.000000',
      state: 'GO',
      origin: 'Distribuidora de Asfalto / Refinaria - Aparecida de Goiânia/GO',
      values: [
        '2531.69815',
        '2531.69815',
        '2626.93638',
        '3738.53',
        '371',
        '0',
        '0',
        '139.96',
        '0',
        '139.96',
        '190.72',
        '3929.25'
      ],
      adopted: true
    },

    {
      code: 'M2092',
      material: 'Emulsão asfáltica para serviço de imprimação',
      icms: '19.000000',
      state: 'GO',
      origin: 'Distribuidora de Asfalto / Refinaria - Aparecida de Goiânia/GO',
      values: [
        '2249.03500',
        '2249.03500',
        '2333.23578',
        '3320.12',
        '371',
        '0',
        '0',
        '250.78',
        '0',
        '250.78',
        '356.04',
        '3676.16'
      ],
      adopted: true
    },

    {
      code: 'M1943-0',
      material: 'Cimento asfáltico CAP 30/45',
      icms: '19.000000',
      state: 'GO',
      origin: 'Distribuidora de Asfalto / Refinaria - Aparecida de Goiânia/GO',
      values: [
        '3563.07772',
        '3563.07772',
        '3696.97828',
        '5250.12',
        '371',
        '0',
        '0',
        '250.78',
        '0',
        '250.78',
        '356.04',
        '5606.16'
      ],
      adopted: true
    },

    {
      code: 'M1943-1',
      material: 'Cimento asfáltico CAP 50/70',
      icms: '19.000000',
      state: 'GO',
      origin: 'Distribuidora de Asfalto / Refinaria - Aparecida de Goiânia/GO',
      values: [
        '3219.15364',
        '3219.15364',
        '3340.27100',
        '4743.54',
        '371',
        '0',
        '0',
        '250.78',
        '0',
        '250.78',
        '356.04',
        '5099.58'
      ],
      adopted: true
    }
  ]);

  readonly filteredRows = computed(() => {
    const term = this.search()
      .trim()
      .toLowerCase();

    if (!term) {
      return this.rows();
    }

    return this.rows().filter(row =>
      row.code.toLowerCase().includes(term) ||
      row.material.toLowerCase().includes(term) ||
      row.state.toLowerCase().includes(term) ||
      row.origin.toLowerCase().includes(term)
    );
  });

  /**
   * Contagem de materiais distintos.
   *
   * Isto é estado da interface, não cálculo de domínio.
   */
  readonly materialCount = computed(() => {
    return new Set(
      this.filteredRows().map(row => row.code)
    ).size;
  });

  /**
   * Contagem das origens marcadas como adotadas.
   */
  readonly adoptedCount = computed(() => {
    return this.filteredRows()
      .filter(row => row.adopted)
      .length;
  });

  updateSearch(value: string): void {
    this.search.set(value);
  }

  clearSearch(): void {
    this.search.set('');
  }

  trackByRow(
    index: number,
    row: BituminousMaterialRow
  ): string {
    return `${row.code}-${row.state}-${row.origin}-${index}`;
  }
}