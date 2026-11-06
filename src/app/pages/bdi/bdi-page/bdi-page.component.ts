import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Bdi,
  BdiQuota,
  BdiMethod,
  BdiRow,
  BdiGroupTotal
} from '../../../models/bdi.model';

import { BdiService } from '../../../services/bdi.service';


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

  rows: BdiRow[] = [];

  bdiOverPv = 0;
  bdiOverCd = 0;
  pvOverCd = 1;

  isCreating = false;
  bdiMethods: BdiMethod[] = [];

  ngOnInit(): void {
    this.loadBdis();
  }


  loadBdis(): void {
    this.bdiLoading = true;
    this.bdiError = null;
    this.selectedBdi = null;

    this.resetCalculation();

    this.bdiService.getBdis().subscribe({
      next: bdis => {
        this.bdis = bdis;

        if (bdis.length > 0) {
          this.onBdiChange(bdis[0]);
          return;
        }

        this.bdiLoading = false;
      },

      error: error => {
        console.error(
          'Erro ao carregar BDI:',
          error
        );

        this.bdis = [];
        this.selectedBdi = null;
        this.bdiLoading = false;

        this.bdiError =
          'Não foi possível carregar os dados de BDI.';

        this.resetCalculation();
      }
    });
    }
    
  private loadBdiMethods(): void {
    this.bdiService.getBdiMethods().subscribe({
      next: methods => {
        this.bdiMethods = methods;
      },
      error: error => {
        console.error(
          'Erro ao carregar métodos de BDI:',
          error
        );
        this.bdiMethods = [];
        this.bdiError =
          'Não foi possível carregar os métodos de BDI.';
      }
    });
  }

  novoBdi(): void {
    this.isCreating = true;
    this.bdiLoading = false;
    this.bdiError = null;

    this.resetCalculation();

    this.selectedBdi = {
      id: 0,
      name: '',
      slug: '',
      method: {
        id: 0,
        method: ''
      },
      observation: '',
      quotas: []
    };

    this.rows = [];
    this.loadBdiMethods();
  }

  onBdiChange(bdi: Bdi | null): void {
    if (!bdi) {
      return;
    }

    this.isCreating = false;
    this.bdiLoading = true;
    this.bdiError = null;

    this.bdiService.getBdi(bdi.id).subscribe({
      next: selectedBdi => {
        this.selectedBdi = selectedBdi;
        this.loadRowsFromQuotas();
        this.bdiLoading = false;
      },
      error: error => {
        console.error(
          'Erro ao carregar BDI:',
          error
        );
        this.bdiError =
          'Não foi possível carregar o BDI selecionado.';
        this.bdiLoading = false;
      }
    });
  }

  onMethodChange(method: BdiMethod | null): void {
    if (!this.selectedBdi) {
      return;
    }

    this.selectedBdi.method =
      method ?? {
        id: 0,
        method: ''
      };
  }

  compareMethods(
    option: BdiMethod | null,
    selected: BdiMethod | null
  ): boolean {
    return option?.id === selected?.id;
  }


  compareBdis(
    option: Bdi | null,
    selected: Bdi | null
  ): boolean {
    return option?.id === selected?.id;
  }


  /**
   * Constrói as linhas da interface diretamente a partir
   * das quotas retornadas pelo budget-engine.
   */
  private loadRowsFromQuotas(): void {
    const quotas =
      this.selectedBdi?.quotas ?? [];

    this.rows = quotas.map(
      quota => this.createRowFromQuota(quota)
    );
  }


  /**
   * Transforma uma quota do budget-engine em uma
   * linha editável da interface.
   */
  private createRowFromQuota(
    quota: BdiQuota
  ): BdiRow {
    return {
      id: quota.id,
      group: quota.group,
      description: quota.description,
      variable: quota.variable,
      base: quota.base,
      parameter: Number(quota.percentage),
      pvPercent: 0,
      cdPercent: 0
    };
  }

  /**
   * Calcula a composição do BDI.
   *
   * A fórmula atual permanece preservada.
   * As quotas utilizadas como parâmetros são obtidas
   * exclusivamente das linhas carregadas do backend.
   */
  calculate(): void {
    if (
      !this.selectedBdi ||
      this.rows.length === 0
    ) {
      this.resetCalculation();
      return;
    }

    /*
     * Os parâmetros necessários para a fórmula são
     * localizados pelas propriedades da quota.
     *
     * A composição visual, entretanto, continua
     * completamente genérica.
     */
    const profit =
      this.getParameterByDescription('LUCRO');

    const administration =
      this.getParameterByDescription(
        'ADMINISTRAÇÃO CENTRAL'
      );

    const selicAnnual =
      this.getParameterByDescription(
        'DESPESAS FINANCEIRAS'
      );

    const risks =
      this.getParameterByDescription('RISCOS');

    const insurance =
      this.getParameterByDescription(
        'SEGUROS E GARANTIAS CONTRATUAIS'
      );

    const cofins =
      this.getParameterByDescription('COFINS');

    const iss =
      this.getParameterByDescription('ISS');

    const issMaterialDeduction =
      this.getParameterByDescription(
        'DEDUÇÃO DE MATERIAIS NO ISS'
      );

    const pis =
      this.getParameterByDescription('PIS');


    const profitDecimal =
      profit / 100;

    const administrationDecimal =
      administration / 100;

    const riskDecimal =
      risks / 100;

    const insuranceDecimal =
      insurance / 100;


    const effectiveIss =
      (iss / 100) *
      (1 - issMaterialDeduction / 100);


    const taxes =
      (cofins / 100) +
      effectiveIss +
      (pis / 100);


    const monthlySelic =
      Math.pow(
        1 + selicAnnual / 100,
        1 / 12
      ) - 1;


    const numerator =
      1 +
      profitDecimal +
      administrationDecimal -
      monthlySelic * profitDecimal;


    const denominator =
      1 -
      monthlySelic -
      riskDecimal -
      insuranceDecimal -
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
      (this.pvOverCd - profitDecimal);


    const financePercentPv =
      financeAmountOverCd /
      this.pvOverCd *
      100;


    const financePercentCd =
      financeAmountOverCd *
      100;


    this.updateRowPercentages(
      profit,
      administration,
      risks,
      insurance,
      cofins,
      iss,
      issMaterialDeduction,
      pis,
      financePercentPv,
      financePercentCd
    );
  }


  /**
   * Obtém o parâmetro de uma quota pela descrição.
   *
   * Essa busca existe somente porque a fórmula atual
   * possui regras matemáticas específicas para essas
   * parcelas.
   *
   * A apresentação e os totais não dependem dessas
   * descrições.
   */
  private getParameterByDescription(
    description: string
  ): number {
    const row = this.rows.find(
      item =>
        item.description === description
    );

    return row
      ? Number(row.parameter) || 0
      : 0;
  }


  /**
   * Atualiza os percentuais calculados de cada quota.
   */
  private updateRowPercentages(
    profit: number,
    administration: number,
    risks: number,
    insurance: number,
    cofins: number,
    iss: number,
    issMaterialDeduction: number,
    pis: number,
    financePercentPv: number,
    financePercentCd: number
  ): void {
    this.rows.forEach(row => {
      switch (row.description) {

        case 'LUCRO':
          row.pvPercent =
            profit / this.pvOverCd;

          row.cdPercent =
            profit;

          break;


        case 'ADMINISTRAÇÃO CENTRAL':
          row.pvPercent =
            administration /
            this.pvOverCd;

          row.cdPercent =
            administration;

          break;


        case 'DESPESAS FINANCEIRAS':
          row.pvPercent =
            financePercentPv;

          row.cdPercent =
            financePercentCd;

          break;


        case 'RISCOS':
          row.pvPercent =
            risks;

          row.cdPercent =
            risks *
            this.pvOverCd;

          break;


        case 'SEGUROS E GARANTIAS CONTRATUAIS':
          row.pvPercent =
            insurance;

          row.cdPercent =
            insurance *
            this.pvOverCd;

          break;


        case 'COFINS':
          row.pvPercent =
            cofins;

          row.cdPercent =
            cofins *
            this.pvOverCd;

          break;


        case 'ISS':
          row.pvPercent =
            (
              iss / 100
            ) *
            (
              1 -
              issMaterialDeduction / 100
            ) *
            100;

          row.cdPercent =
            row.pvPercent *
            this.pvOverCd;

          break;


        case 'DEDUÇÃO DE MATERIAIS NO ISS':
          row.pvPercent = 0;
          row.cdPercent = 0;
          break;


        case 'PIS':
          row.pvPercent =
            pis;

          row.cdPercent =
            pis *
            this.pvOverCd;

          break;


        default:
          /*
           * Quotas ainda não contempladas pela fórmula
           * específica permanecem sem percentual calculado.
           *
           * Elas continuam sendo exibidas normalmente
           * porque a apresentação é genérica.
           */
          row.pvPercent = 0;
          row.cdPercent = 0;
      }
    });
  }


  /**
   * Retorna os totais agrupados dinamicamente pelo
   * valor de row.group.
   *
   * Nenhum grupo é conhecido previamente pelo componente.
   */
  get groupTotals(): BdiGroupTotal[] {
    const totals =
      new Map<string, BdiGroupTotal>();

    for (const row of this.rows) {
      const group =
        row.group?.trim();

      if (!group) {
        continue;
      }

      const existing =
        totals.get(group);

      if (existing) {
        existing.pvPercent +=
          row.pvPercent;

        existing.cdPercent +=
          row.cdPercent;

        continue;
      }

      totals.set(group, {
        group,
        pvPercent: row.pvPercent,
        cdPercent: row.cdPercent
      });
    }

    return Array.from(
      totals.values()
    );
  }


  /**
   * Total geral calculado diretamente sobre todas
   * as quotas.
   */
  get totalPv(): number {
    return this.rows.reduce(
      (total, row) =>
        total + row.pvPercent,
      0
    );
  }


  get totalCd(): number {
    return this.rows.reduce(
      (total, row) =>
        total + row.cdPercent,
      0
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


  private resetCalculation(): void {
    this.rows = [];

    this.bdiOverPv = 0;
    this.bdiOverCd = 0;
    this.pvOverCd = 1;
  }
}