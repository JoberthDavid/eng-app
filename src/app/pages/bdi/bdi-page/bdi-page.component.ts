import {
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';


interface BdiRow {
  group: string;
  description: string;
  variable: string;
  pvPercent: number;
  cdPercent: number;
}


@Component({
  selector: 'app-bdi-page',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './bdi-page.component.html',

  styleUrl: './bdi-page.component.scss'
})
export class BdiPageComponent {


  /*
   * IDENTIFICAÇÃO
   */

  highway = 'BR-010/GO';

  km = 'KM 0,0 ao KM 227,3 (eixo principal)';

  snv = '202310A';

  baseDate = 'jan/24';


  /*
   * REGIME
   */

  regime = 'onerado';


  /*
   * PARÂMETROS DO BDI
   *
   * Valores da imagem de referência.
   */

  profit = 12.00;

  centralAdministration = 9.00;

  selicAnnual = 10.65;

  risks = 0.50;

  insurance = 0.25;


  /*
   * TRIBUTOS
   */

  cofins = 3.00;

  iss = 5.00;

  issMaterialDeduction = 40.00;

  pis = 0.65;


  /*
   * RESULTADOS
   */

  rows: BdiRow[] = [];

  bdiOverPv = 0;

  bdiOverCd = 0;

  pvOverCd = 1;


  /*
   * CONSTRUTOR
   */

  constructor() {

    this.calculate();

  }


  /*
   * CÁLCULO PRINCIPAL
   */

  calculate(): void {

    /*
     * Conversão dos percentuais
     * para valores decimais.
     */

    const profit =
      this.profit / 100;

    const administration =
      this.centralAdministration / 100;

    const risk =
      this.risks / 100;

    const insurance =
      this.insurance / 100;


    /*
     * ISS efetivamente aplicado
     *
     * ISS = 5%
     *
     * Dedução de materiais = 40%
     *
     * ISS efetivo:
     *
     * 5% × (100% - 40%)
     *
     * = 3%
     */

    const effectiveIss =
      (this.iss / 100) *
      (1 - this.issMaterialDeduction / 100);


    /*
     * Tributos sobre PV.
     */

    const taxes =
      (this.cofins / 100) +
      effectiveIss +
      (this.pis / 100);


    /*
     * SELIC mensal equivalente.
     *
     * i_m =
     *
     * (1 + i_a)^(1/12) - 1
     */

    const monthlySelic =
      Math.pow(
        1 + this.selicAnnual / 100,
        1 / 12
      ) - 1;


    /*
     * Relação:
     *
     * PV / CD
     *
     * considerando:
     *
     * lucro sobre CD
     * administração sobre CD
     * financeiro sobre (PV - lucro)
     * riscos sobre PV
     * seguros sobre PV
     * tributos sobre PV
     */

    const numerator =
      1 +
      profit +
      administration -
      monthlySelic * profit;


    const denominator =
      1 -
      monthlySelic -
      risk -
      insurance -
      taxes;


    this.pvOverCd =
      numerator / denominator;


    /*
     * BDI sobre CD.
     */

    this.bdiOverCd =
      (this.pvOverCd - 1) * 100;


    /*
     * BDI sobre PV.
     */

    this.bdiOverPv =
      (1 - 1 / this.pvOverCd) * 100;


    /*
     * Monta as linhas da tabela.
     */

    const financeAmountOverCd =
      monthlySelic *
      (
        this.pvOverCd -
        profit
      );


    const financePercentPv =
      financeAmountOverCd /
      this.pvOverCd *
      100;


    const financePercentCd =
      financeAmountOverCd *
      100;


    this.rows = [

      /*
       * BENEFÍCIOS
       */

      {
        group: 'BENEFÍCIOS',
        description: 'LUCRO',
        variable: `${this.formatNumber(this.profit)}% do CD`,
        pvPercent:
          this.profit /
          this.pvOverCd,
        cdPercent:
          this.profit
      },


      /*
       * DESPESAS INDIRETAS
       */

      {
        group: 'DESPESAS INDIRETAS',
        description: 'ADMINISTRAÇÃO CENTRAL',
        variable:
          `${this.formatNumber(this.centralAdministration)}% do CD`,
        pvPercent:
          this.centralAdministration /
          this.pvOverCd,
        cdPercent:
          this.centralAdministration
      },


      {
        group: 'DESPESAS INDIRETAS',
        description: 'DESPESAS FINANCEIRAS',
        variable:
          `[(1+SELIC)1/12 - 1] do (PV - Lucro)`,
        pvPercent:
          financePercentPv,
        cdPercent:
          financePercentCd
      },


      {
        group: 'DESPESAS INDIRETAS',
        description: 'RISCOS',
        variable:
          `${this.formatNumber(this.risks)}% do PV`,
        pvPercent:
          this.risks,
        cdPercent:
          this.risks *
          this.pvOverCd
      },


      {
        group: 'DESPESAS INDIRETAS',
        description:
          'SEGUROS E GARANTIAS CONTRATUAIS',
        variable:
          `${this.formatNumber(this.insurance)}% do PV`,
        pvPercent:
          this.insurance,
        cdPercent:
          this.insurance *
          this.pvOverCd
      },


      /*
       * TRIBUTOS
       */

      {
        group: 'TRIBUTOS',
        description: 'COFINS',
        variable:
          `${this.formatNumber(this.cofins)}% do PV`,
        pvPercent:
          this.cofins,
        cdPercent:
          this.cofins *
          this.pvOverCd
      },


      {
        group: 'TRIBUTOS',
        description: 'ISS',
        variable:
          `${this.formatNumber(this.iss)}% do PV`,
        pvPercent:
          effectiveIss * 100,
        cdPercent:
          effectiveIss *
          this.pvOverCd *
          100
      },


      {
        group: 'TRIBUTOS',
        description: 'PIS',
        variable:
          `${this.formatNumber(this.pis)}% do PV`,
        pvPercent:
          this.pis,
        cdPercent:
          this.pis *
          this.pvOverCd
      }

    ];

  }


  /*
   * FORMATAÇÃO
   */

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


  /*
   * TOTAL DE DESPESAS INDIRETAS
   */

  get indirectPv(): number {

    return (
      this.rows
        .filter(
          row =>
            row.group ===
            'DESPESAS INDIRETAS'
        )
        .reduce(
          (sum, row) =>
            sum + row.pvPercent,
          0
        )
    );

  }


  get indirectCd(): number {

    return (
      this.rows
        .filter(
          row =>
            row.group ===
            'DESPESAS INDIRETAS'
        )
        .reduce(
          (sum, row) =>
            sum + row.cdPercent,
          0
        )
    );

  }


  /*
   * TOTAL DE TRIBUTOS
   */

  get taxesPv(): number {

    return (
      this.rows
        .filter(
          row =>
            row.group === 'TRIBUTOS'
        )
        .reduce(
          (sum, row) =>
            sum + row.pvPercent,
          0
        )
    );

  }


  get taxesCd(): number {

    return (
      this.rows
        .filter(
          row =>
            row.group === 'TRIBUTOS'
        )
        .reduce(
          (sum, row) =>
            sum + row.cdPercent,
          0
        )
    );

  }


  /*
   * TOTAL DE BENEFÍCIOS
   */

  get benefitsPv(): number {

    return (
      this.rows
        .filter(
          row =>
            row.group === 'BENEFÍCIOS'
        )
        .reduce(
          (sum, row) =>
            sum + row.pvPercent,
          0
        )
    );

  }


  get benefitsCd(): number {

    return (
      this.rows
        .filter(
          row =>
            row.group === 'BENEFÍCIOS'
        )
        .reduce(
          (sum, row) =>
            sum + row.cdPercent,
          0
        )
    );

  }


  /*
   * ISS EFETIVO
   */

  get effectiveIss(): number {

    return (
      this.iss *
      (1 - this.issMaterialDeduction / 100)
    );

  }

}