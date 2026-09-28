import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CompositionTreeNode }
  from '../../models/composition-tree.model';

import { CompositionTreeNodeComponent }
  from '../composition-tree-node/composition-tree-node.component';

@Component({
  selector: 'app-composition-tree',
  standalone: true,
  imports: [
    CompositionTreeNodeComponent
  ],
  templateUrl: './composition-tree.component.html',
  styleUrl: './composition-tree.component.scss'
})
export class CompositionTreeComponent {

  @Input()
  root: CompositionTreeNode | null = null;

  @Input()
  selectedCode: string | null = null;

  @Output()
  compositionSelected =
    new EventEmitter<CompositionTreeNode>();

  onNodeSelected(
    node: CompositionTreeNode
  ): void {
    this.compositionSelected.emit(node);
  }
}