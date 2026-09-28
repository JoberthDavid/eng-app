import { Injectable, signal } from '@angular/core';

import { CompositionTreeNode } from '../models/composition-tree.model';

@Injectable({
  providedIn: 'root'
})
export class CompositionNavigationService {
  private readonly activeTreeSignal =
    signal<CompositionTreeNode | null>(null);

  private readonly selectedNodeSignal =
    signal<CompositionTreeNode | null>(null);

  readonly activeTree =
    this.activeTreeSignal.asReadonly();

  readonly selectedNode =
    this.selectedNodeSignal.asReadonly();

  setActiveTree(
    tree: CompositionTreeNode | null
  ): void {
    this.activeTreeSignal.set(tree);
    this.selectedNodeSignal.set(tree);
  }

  selectNode(
    node: CompositionTreeNode
  ): void {
    this.selectedNodeSignal.set(node);
  }

  clear(): void {
    this.activeTreeSignal.set(null);
    this.selectedNodeSignal.set(null);
  }
}