import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CompositionTreeNode } from '../../models/composition-tree.model';

@Component({
  selector: 'app-composition-tree-node',
  standalone: true,
  imports: [],
  templateUrl: './composition-tree-node.component.html',
  styleUrl: './composition-tree-node.component.scss'
})

export class CompositionTreeNodeComponent {

  @Input({ required: true })
  node!: CompositionTreeNode;

  @Input()
  selectedCode: string | null = null;

  @Output()
  nodeSelected =
    new EventEmitter<CompositionTreeNode>();

  selectNode(): void {
    this.nodeSelected.emit(this.node);
  }
}