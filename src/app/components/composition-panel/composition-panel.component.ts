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
  CompositionCalculationDetailResponse
} from '../../core/integrations/composition/composition.models';


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


  @Input()
  calculation:
    CompositionCalculationDetailResponse | null = null;


  @Input()
  scrollable = false;


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