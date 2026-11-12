import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { finalize } from 'rxjs';

import {
  Bdi,
  BdiQuota,
  BdiMethod,
  BdiRow,
  BdiGroupTotal,
  BdiCreateRequest,
  BdiUpdateRequest,
  BdiQuotaInput
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
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

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

  isEditing = false;
  isSaving = false;
  isDeleting = false;
  originalBdi: Bdi | null = null;


  get isFormEditable(): boolean {
    return this.isCreating || this.isEditing;
  }

  /**
   * Atualiza o nome e gera automaticamente o slug do BDI.
   */
  onBdiNameChange(name: string): void {

    if (!this.selectedBdi) {
      return;
    }

    this.selectedBdi.name = name;

    this.selectedBdi.slug = this.generateSlug(name);

  }


  /**
   * Gera um identificador compatível com o SlugField do Django.
   */
  private generateSlug(value: string): string {

    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  }

  ngOnInit(): void {

    this.loadBdiMethods();

    this.route.paramMap.subscribe(params => {

      const id = params.get('id');

      if (id) {

        this.loadBdi(Number(id));

        return;
      }

      this.loadBdis();

    });

  }

  loadBdi(id: number): void {

    this.bdiLoading = true;

    this.bdiError = null;

    this.isCreating = false;

    this.isEditing = true;

    this.bdiService.getBdi(id)
      .pipe(
        finalize(() => {
          this.bdiLoading = false;
        })
      )
      .subscribe({

        next: bdi => {

          this.selectedBdi = structuredClone(bdi);

          this.originalBdi = structuredClone(bdi);

          this.bdis = [
            ...this.bdis.filter(item => item.id !== bdi.id),
            bdi
          ];

          this.loadRowsFromQuotas();

          this.calculate();

        },

        error: error => {

          console.error(error);

          this.bdiError =
            'Não foi possível carregar o BDI solicitado.';

          this.selectedBdi = null;

        }

      });

  }

  loadBdis(): void {
    console.log('[BDI] loadBdis() iniciado');

    this.bdiLoading = true;
    this.bdiError = null;
    this.selectedBdi = null;

    this.resetCalculation();

    this.bdiService.getBdis().subscribe({
      next: bdis => {
        console.log('[BDI] Callback next executado');
        console.log('[BDI] Tipo da resposta:', Array.isArray(bdis));
        console.log('[BDI] Registros recebidos:', bdis);

        this.bdis = [...bdis];

        console.log('[BDI] this.bdis:', this.bdis);
        console.log('[BDI] Quantidade:', this.bdis.length);

        this.bdiLoading = false;
      },

      error: error => {
        console.error('[BDI] Callback error executado:', error);

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

      this.selectedBdi = null;
      this.originalBdi = null;

      this.isCreating = false;
      this.isEditing = false;

      this.bdiError = null;

      this.resetCalculation();

      return;
    }

    this.isCreating = false;
    this.isEditing = false;

    this.bdiLoading = true;
    this.bdiError = null;

    this.bdiService.getBdi(bdi.id).subscribe({

      next: selectedBdi => {

        this.selectedBdi = structuredClone(selectedBdi);
        this.originalBdi = structuredClone(selectedBdi);

        this.loadRowsFromQuotas();

        this.calculate();

        this.bdiLoading = false;

      },

      error: error => {

        console.error('Erro ao carregar BDI:', error);

        this.selectedBdi = null;
        this.originalBdi = null;

        this.bdiError = this.getApiErrorMessage(
          error,
          'Não foi possível carregar o BDI selecionado.'
        );

        this.resetCalculation();

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


  saveNewBdi(): void {

    const request = this.buildBdiRequest();

    if (!request) {

      this.bdiError =
        'Informe todos os dados obrigatórios do BDI.';

      return;

    }

    this.isSaving = true;

    this.bdiService.createBdi(request)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe({

        next: bdi => {

          this.bdis = [
            ...this.bdis,
            bdi
          ];

          this.router.navigate([
            '/bdi',
            bdi.id
          ]);

        },

        error: error => {

          console.error(error);

          this.bdiError =
            this.getApiErrorMessage(
              error,
              'Não foi possível criar o BDI.'
            );

        }

      });

  }

  updateBdi(): void {

    if (!this.selectedBdi) {
      return;
    }

    const request = this.buildBdiRequest();

    if (!request) {

      this.bdiError =
        'Não foi possível preparar os dados do BDI.';

      return;

    }

    this.isSaving = true;

    this.bdiService.updateBdi(
      this.selectedBdi.id,
      request
    )
    .pipe(
      finalize(() => {
        this.isSaving = false;
      })
    )
    .subscribe({

      next: bdi => {

        this.selectedBdi = structuredClone(bdi);

        this.originalBdi = structuredClone(bdi);

        this.rows = bdi.quotas.map(
          quota => this.createRowFromQuota(quota)
        );

        this.bdis = this.bdis.map(item =>
          item.id === bdi.id ? bdi : item
        );

        this.calculate();

      },

      error: error => {

        console.error(error);

        this.bdiError =
          this.getApiErrorMessage(
            error,
            'Não foi possível atualizar o BDI.'
          );

      }

    });

  }

  deleteBdi(): void {

    if (!this.selectedBdi) {
      return;
    }

    const confirmed = window.confirm(
      `Confirma a exclusão do BDI "${this.selectedBdi.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const id = this.selectedBdi.id;

    this.isDeleting = true;

    this.bdiService.deleteBdi(id)
      .pipe(
        finalize(() => {
          this.isDeleting = false;
        })
      )
      .subscribe({

          next: () => {

            this.bdis = this.bdis.filter(
              item => item.id !== id
            );

            this.router.navigate(['/bdi']);

          },

        error: error => {

          console.error(error);

          this.bdiError =
            this.getApiErrorMessage(
              error,
              'Não foi possível excluir o BDI.'
            );

        }

      });

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
    
  private buildBdiRequest(): BdiCreateRequest | null {

    if (!this.selectedBdi) {
      return null;
    }

    const name = this.selectedBdi.name?.trim();
    const slug = this.generateSlug(name ?? '');
    const methodId = this.selectedBdi.method?.id;

    this.selectedBdi.slug = slug;

    if (!name || !slug || !methodId) {
      return null;
    }

    const quotas: BdiQuotaInput[] = [];

    for (const row of this.rows) {

      const group = row.group?.trim();
      const description = row.description?.trim();
      const variable = row.variable?.trim();

      if (!group || !description || !variable) {
        return null;
      }

      if (
        row.parameter === null ||
        row.parameter === undefined ||
        String(row.parameter).trim() === ''
      ) {
        return null;
      }

      const percentage = Number(row.parameter);

      if (!Number.isFinite(percentage) || percentage < 0) {
        return null;
      }

      if (row.base !== 'CD' && row.base !== 'PV') {
        return null;
      }

      quotas.push({
        group,
        description,
        percentage,
        variable,
        base: row.base
      });
    }

    return {
      name,
      slug,
      method_id: methodId,
      observation: this.selectedBdi.observation ?? '',
      quotas
    };
  }

  addQuota(): void {

    this.rows = [
      ...this.rows,
      {
        id: 0,
        group: '',
        description: '',
        variable: '',
        base: 'CD',
        parameter: 0,
        pvPercent: 0,
        cdPercent: 0
      }
    ];

  }

  removeQuota(index: number): void {

    this.rows = this.rows.filter(
      (_, currentIndex) => currentIndex !== index
    );

    this.calculate();

  }

  private getApiErrorMessage(
    error: any,
    fallback: string
  ): string {

    const apiError = error?.error;

    if (apiError?.message) {

      const details = apiError.details;

      if (details && typeof details === 'object') {

        const messages = Object.entries(details)
          .flatMap(([field, errors]) => {

            const values = Array.isArray(errors)
              ? errors
              : [errors];

            return values.map(
              message => `${field}: ${message}`
            );

          });

        if (messages.length > 0) {
          return `${apiError.message} ${messages.join('; ')}`;
        }
      }

      return apiError.message;
    }

    return apiError?.detail ?? fallback;
  }


}
