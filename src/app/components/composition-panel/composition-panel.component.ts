import {
  Component,
  Input
} from '@angular/core';

import {
  DecimalPipe,
  registerLocaleData
} from '@angular/common';

import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

import {
  CompositionCatalogItem
} from '../../models/budget.model';

import {
  CompositionCalculationDetailResponse,
  CompositionSectionTotals
} from '../../core/integrations/composition/composition.models';

import {
  CompositionCatalogData
} from '../../services/composition-catalog.service';

@Component({
  selector: 'app-composition-panel',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './composition-panel.component.html',
  styleUrl: './composition-panel.component.scss'
})
export class CompositionPanelComponent {

  @Input()
  composition:
    CompositionCatalogItem | null = null;

  @Input() compositionCatalog:
    CompositionCatalogData | null = null;

  @Input()
  calculation:
    CompositionCalculationDetailResponse | null = null;

  @Input()
  sectionTotals: CompositionSectionTotals | null = null;


  @Input()
  scrollable = false;


  formatMonthYear(value: string | null | undefined): string {
    if (!value?.trim()) {
      return '—';
    }

    const date = value.trim();
    const isoMatch = /^(\d{4})-(\d{2})-\d{2}(?:$|T)/.exec(date);
    const brazilianMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
    const monthYearMatch = /^(\d{2})\/(\d{4})$/.exec(date);

    const month = isoMatch
      ? isoMatch[2]
      : brazilianMatch
        ? brazilianMatch[2]
        : monthYearMatch?.[1];

    const year = isoMatch
      ? isoMatch[1]
      : brazilianMatch
        ? brazilianMatch[3]
        : monthYearMatch?.[2];

    const monthNames = [
      'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
      'jul', 'ago', 'set', 'out', 'nov', 'dez'
    ];
    const monthIndex = Number(month) - 1;

    if (
      year &&
      Number.isInteger(monthIndex) &&
      monthIndex >= 0 &&
      monthIndex < monthNames.length
    ) {
      return `${monthNames[monthIndex]}/${year}`;
    }

    return '—';
  }


  getCalculatedEquipments() {

    return (
      this.calculation?.detail.equipment
      ?? []
    );

  }


  getCalculatedLabor() {

    return (
      this.calculation?.detail.labor
      ?? []
    );

  }


  getCalculatedMaterials() {

    return (
      this.calculation?.detail.materials
      ?? []
    );

  }


  getCalculatedAuxiliaryCompositions() {

    return (
      this.calculation?.detail.composition_references.filter(
        reference => reference.group === 'AX'
      )
      ?? []
    );

  }


  getCalculatedFixedTimeCompositions() {

    return (
      this.calculation?.detail.composition_references.filter(
        reference => reference.group === 'TF'
      )
      ?? []
    );

  }

  getEquipments() {

    return this.composition?.inputs.filter(
      input => input.inputGroup === 'EQ'
    ) ?? [];

  }


  getLabor() {

    return this.composition?.inputs.filter(
      input => input.inputGroup === 'MO'
    ) ?? [];

  }


  getMaterials() {

    return this.composition?.inputs.filter(
      input => input.inputGroup === 'MA'
    ) ?? [];

  }


  getAuxiliaryCompositions() {

    return (
      this.composition?.auxiliaryCompositions
      ?? []
    );

  }


  getFixedTimeCompositions() {

    return (
      this.composition?.fixedTimeCompositions
      ?? []
    );

  }

}
