import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Bdi, BdiQuota } from '../../../models/bdi.model';
import { BdiService } from '../../../services/bdi.service';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './bdi-page.component.html',
  styleUrl: './bdi-page.component.scss'
})
export class BdiPageComponent implements OnInit {
  private readonly bdiService = inject(BdiService);

  bdis: Bdi[] = [];
  selectedBdi: Bdi | null = null;

  bdiLoading = false;
  bdiError: string | null = null;

  /*
   * Parâmetros do BDI.
   *
   * Estes valores deixam de ser a fonte de dados.
   * São preenchidos a partir das quotas retornadas pelo budget-engine.
   */
  profit = 0;
  centralAdministration = 0;
  selicAnnual = 0;
  risks = 0;
  insurance = 0;

  cofins = 0;
  iss = 0;
  issMaterialDeduction = 0;
  pis = 0;

  rows: BdiRow[] = [];

  bdiOverPv = 0;
  bdiOverCd = 0;
  pvOverCd = 1;

  ngOnInit(): void {
    this.loadBdis();
  }

  loadBdis(): void {
    this.bdiLoading = true;
    this.bdiError = null;

    this.bdiService.getBdis().subscribe({
      next: bdis => {
        this.bdis = bdis;
        this.bdiLoading = false;

        if (bdis.length > 0) {
          this.selectedBdi = bdis[0];
          this.applyBdiParameters();
          this.calculate();
        }
      },
      error: error => {
        console.error('Erro ao carregar BDI:', error);

        this.bdis = [];
        this.selectedBdi = null;
        this.bdiLoading = false;
        this.bdiError = 'Não foi possível carregar os dados de BDI.';
      }
    });
  }

  onBdiChange(bdi: Bdi | null): void {
    this.selectedBdi = bdi;

    if (!bdi) {
      this.resetCalculation();
      return;
    }

    this.applyBdiParameters();
    this.calculate();
  }

  /**
   * Obtém o percentual de uma quota diretamente do BDI
   * retornado pelo budget-engine.
   */
  private getQuotaPercentage(description: string): number {
    const quota = this.selectedBdi?.quotas.find(
      item => item.description === description
    );

    return quota ? Number(quota.percentage) : 0;
  }

  /**
   * Transforma as quotas do budget-engine nos parâmetros
   * utilizados pela fórmula atualmente existente no eng-app.
   *
   * Não há valores mockados aqui.
   */
  private applyBdiParameters(): void {
    this.profit = this.getQuotaPercentage('LUCRO');

    this.centralAdministration =
      this.getQuotaPercentage('ADMINISTRAÇÃO CENTRAL');

    this.selicAnnual =
      this.getQuotaPercentage('DESPESAS FINANCEIRAS');

    this.risks =
      this.getQuotaPercentage('RISCOS');

    this.insurance =
      this.getQuotaPercentage(
        'SEGUROS E GARANTIAS CONTRATUAIS'
      );

    this.cofins =
      this.getQuotaPercentage('COFINS');

    this.iss =
      this.getQuotaPercentage('ISS');

    this.issMaterialDeduction =
      this.getQuotaPercentage(
        'DEDUÇÃO DE MATERIAIS NO ISS'
      );

    this.pis =
      this.getQuotaPercentage('PIS');
  }

  calculate(): void {
    const profit = this.profit / 100;
    const administration =
      this.centralAdministration / 100;

    const risk =
      this.risks / 100;

    const insurance =
      this.insurance / 100;

    const effectiveIss =
      (this.iss / 100) *
      (1 - this.issMaterialDeduction / 100);

    const taxes =
      (this.cofins / 100) +
      effectiveIss +
      (this.pis / 100);

    const monthlySelic =
      Math.pow(
        1 + this.selicAnnual / 100,
        1 / 12
      ) - 1;

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

    if (denominator === 0) {
      this.resetCalculation();
      return;
    }

    this.pvOverCd =
      numerator / denominator;

    this.bdiOverCd =
      (this.pvOverCd - 1) * 100;

    this.bdiOverPv =
      (1 - 1 / this.pvOverCd) * 100;

    const financeAmountOverCd =
      monthlySelic *
      (this.pvOverCd - profit);

    const financePercentPv =
      financeAmountOverCd /
      this.pvOverCd *
      100;

    const financePercentCd =
      financeAmountOverCd *
      100;

    this.rows = [
      {
        group: 'BENEFÍCIOS',
        description: 'LUCRO',
        variable: `${this.formatNumber(this.profit)}% do CD`,
        pvPercent:
          this.profit / this.pvOverCd,
        cdPercent:
          this.profit
      },
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

  formatNumber(
    value: number,
    digits = 2
  ): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  }

  get indirectPv(): number {
    return this.rows
      .filter(
        row =>
          row.group === 'DESPESAS INDIRETAS'
      )
      .reduce(
        (total, row) =>
          total + row.pvPercent,
        0
      );
  }

  get indirectCd(): number {
    return this.rows
      .filter(
        row =>
          row.group === 'DESPESAS INDIRETAS'
      )
      .reduce(
        (total, row) =>
          total + row.cdPercent,
        0
      );
  }

  get taxesPv(): number {
    return this.rows
      .filter(
        row =>
          row.group === 'TRIBUTOS'
      )
      .reduce(
        (total, row) =>
          total + row.pvPercent,
        0
      );
  }

  get taxesCd(): number {
    return this.rows
      .filter(
        row =>
          row.group === 'TRIBUTOS'
      )
      .reduce(
        (total, row) =>
          total + row.cdPercent,
        0
      );
  }

  get benefitsPv(): number {
    return this.rows
      .filter(
        row =>
          row.group === 'BENEFÍCIOS'
      )
      .reduce(
        (total, row) =>
          total + row.pvPercent,
        0
      );
  }

  get benefitsCd(): number {
    return this.rows
      .filter(
        row =>
          row.group === 'BENEFÍCIOS'
      )
      .reduce(
        (total, row) =>
          total + row.cdPercent,
        0
      );
  }

  get effectiveIss(): number {
    return this.iss *
      (1 - this.issMaterialDeduction / 100);
  }

  private resetCalculation(): void {
    this.rows = [];
    this.bdiOverPv = 0;
    this.bdiOverCd = 0;
    this.pvOverCd = 1;
  }
}