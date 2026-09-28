import {
  Component,
  Input,
  inject
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { CompositionTreeComponent }
  from '../../components/composition-tree/composition-tree.component';

import { CompositionTreeNode }
  from '../../models/composition-tree.model';

import { CompositionNavigationService }
  from '../../services/composition-navigation.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CompositionTreeComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  private readonly compositionNavigationService =
    inject(CompositionNavigationService);

  readonly compositionTree =
    this.compositionNavigationService.activeTree;

  readonly selectedNode =
    this.compositionNavigationService.selectedNode;

  @Input()
  appName = 'ENG-APP';

  @Input()
  appSubtitle = 'Engenharia';

  get selectedCompositionCode(): string | null {
    const node = this.selectedNode();

    if (!node) {
      return null;
    }

    return node.composition.code;
  }

  onCompositionSelected(
    node: CompositionTreeNode
  ): void {
    this.compositionNavigationService.selectNode(node);
  }
}