import {
  Component,
  OnDestroy,
  inject
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { ProjectService } from '../../../services/project.service';
import { CompositionTreeService } from '../../../services/composition-tree.service';
import { CompositionNavigationService } from '../../../services/composition-navigation.service';

import { CompositionTreeNode } from '../../../models/composition-tree.model';

import { CompositionPanelComponent }
  from '../../../components/composition-panel/composition-panel.component';

@Component({
  selector: 'app-composition-page',
  standalone: true,
  imports: [
    CompositionPanelComponent
  ],
  templateUrl: './composition-page.component.html',
  styleUrl: './composition-page.component.scss'
})
export class CompositionPageComponent implements OnDestroy {

  private readonly route = inject(ActivatedRoute);

  private readonly projectService =
    inject(ProjectService);

  private readonly compositionTreeService =
    inject(CompositionTreeService);

  private readonly compositionNavigationService =
    inject(CompositionNavigationService);

  readonly selectedNode =
    this.compositionNavigationService.selectedNode;

  compositionCode =
    this.route.snapshot.paramMap.get('code');

  composition =
    this.compositionCode
      ? this.projectService.getComposition(
          this.compositionCode
        )
      : null;

  compositionTree =
    this.compositionCode
      ? this.compositionTreeService.buildTree(
          this.compositionCode
        )
      : null;

  constructor() {
    this.compositionNavigationService.setActiveTree(
      this.compositionTree
    );
  }

  ngOnDestroy(): void {
    this.compositionNavigationService.clear();
  }

  /**
   * Indica se o usuário selecionou uma composição
   * auxiliar (AX) ou de tempo fixo (TF).
   *
   * A composição ROOT representa o estado normal
   * da página e não deve abrir o layout de dois painéis.
   */
  get isChildSelection(): boolean {
    const selected = this.selectedNode();

    return (
      selected !== null &&
      selected.referenceType !== 'ROOT'
    );
  }

  /**
   * Retorna o nó pai da composição selecionada.
   */
  get parentNode(): CompositionTreeNode | null {
    const tree = this.compositionTree;
    const selected = this.selectedNode();

    if (!tree || !selected) {
      return null;
    }

    return this.compositionTreeService.findParent(
      tree,
      selected.composition.code
    );
  }

  /**
   * Retorna a composição atualmente selecionada.
   *
   * Aqui o nó selecionado será mostrado no painel inferior.
   */
  get childNode(): CompositionTreeNode | null {
    return this.selectedNode();
  }
}