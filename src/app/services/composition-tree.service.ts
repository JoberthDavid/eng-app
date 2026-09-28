import { Injectable } from '@angular/core';

import {
  CompositionItem,
  CompositionReference
} from '../models/budget.model';

import {
  CompositionReferenceType,
  CompositionTreeNode
} from '../models/composition-tree.model';

import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class CompositionTreeService {

  constructor(
    private readonly projectService: ProjectService
  ) {}

  buildTree(rootCode: string): CompositionTreeNode | null {
    const rootComposition =
      this.projectService.getComposition(rootCode);

    if (!rootComposition) {
      return null;
    }

    return this.buildNode(
      rootComposition,
      null,
      'ROOT',
      0,
      new Set<string>()
    );
  }

  private buildNode(
    composition: CompositionItem,
    reference: CompositionReference | null,
    referenceType: CompositionReferenceType,
    level: number,
    visited: Set<string>
  ): CompositionTreeNode {

    if (visited.has(composition.code)) {
      return {
        composition,
        reference,
        referenceType,
        level,
        children: []
      };
    }

    const nextVisited = new Set(visited);
    nextVisited.add(composition.code);

    const children: CompositionTreeNode[] = [];

    for (const auxiliary of composition.auxiliaryCompositions) {
      const childComposition =
        this.projectService.getComposition(auxiliary.code);

      if (childComposition) {
        children.push(
          this.buildNode(
            childComposition,
            auxiliary,
            'AUXILIARY',
            level + 1,
            nextVisited
          )
        );
      }
    }

    for (const fixedTime of composition.fixedTimeCompositions) {
      const childComposition =
        this.projectService.getComposition(fixedTime.code);

      if (childComposition) {
        children.push(
          this.buildNode(
            childComposition,
            fixedTime,
            'FIXED_TIME',
            level + 1,
            nextVisited
          )
        );
      }
    }

    return {
      composition,
      reference,
      referenceType,
      level,
      children
    };
  }

  findNode(
    root: CompositionTreeNode,
    code: string
  ): CompositionTreeNode | null {
    if (root.composition.code === code) {
      return root;
    }

    for (const child of root.children) {
      const result = this.findNode(child, code);

      if (result) {
        return result;
      }
    }

    return null;
  }

  findParent(
    root: CompositionTreeNode,
    code: string
  ): CompositionTreeNode | null {
    for (const child of root.children) {
      if (child.composition.code === code) {
        return root;
      }

      const result = this.findParent(child, code);

      if (result) {
        return result;
      }
    }

    return null;
  }
  
}