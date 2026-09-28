import {
  Component,
  Input
} from '@angular/core';

import {
  CompositionItem
} from '../../models/budget.model';

@Component({
  selector: 'app-composition-panel',
  standalone: true,
  imports: [],
  templateUrl: './composition-panel.component.html',
  styleUrl: './composition-panel.component.scss'
})
export class CompositionPanelComponent {

  @Input()
  composition: CompositionItem | null = null;

  /**
   * Quando true, o conteúdo da composição utiliza
   * scroll vertical próprio.
   *
   * Quando false, o conteúdo ocupa o fluxo normal
   * da página.
   */
  @Input()
  scrollable = false;

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
    return this.composition?.auxiliaryCompositions ?? [];
  }

  getFixedTimeCompositions() {
    return this.composition?.fixedTimeCompositions ?? [];
  }
}