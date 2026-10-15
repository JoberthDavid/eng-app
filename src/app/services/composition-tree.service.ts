import { Injectable } from '@angular/core';

import {
  CompositionCatalogItem,
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

  buildTree(
    rootCode: string,
    rootComposition: CompositionCatalogItem | null = null
  ): CompositionTreeNode | null {

    const composition =
      rootComposition ??
      this.projectService.getComposition(rootCode);

    if (!composition) {
      return null;
    }

    return this.buildNode(
      composition,
      null,
      'ROOT',
      0,
      new Set<string>()
    );
  }

  private buildNode(
    composition: CompositionCatalogItem,
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

  private formatUnitCost(
    value: number
  ): string {

    return (
      `R$ ${value.toFixed(2).replace('.', ',')}`
    );
  }

  buildTreeFromReferences(
    rootComposition: CompositionCatalogItem,
    references: Array<{
      group: string;
      code: string;
      description: string;
      unit: string;
      quantity: string;
      child_unit_cost: string;
      line_cost: string;
    }>
  ): CompositionTreeNode {

    const children: CompositionTreeNode[] =
      references.map(reference => {

        const childComposition: CompositionCatalogItem = {
          code: reference.code,
          description: reference.description,
          referenceDate: rootComposition.referenceDate,
          referenceBaseDate: rootComposition.referenceBaseDate,
          factor: 1,
          unitCost: this.formatUnitCost(Number(reference.child_unit_cost)),
          totalCost: this.formatUnitCost(Number(reference.line_cost)),
          auxiliaryCompositions: [],
          fixedTimeCompositions: [],
          inputs: []
        };

        return {
          composition: childComposition,
          reference: {
            code: reference.code,
            description: reference.description,
            unit: reference.unit,
            quantity: Number(reference.quantity)
          },
          referenceType:
            reference.group === 'AX'
              ? 'AUXILIARY'
              : 'FIXED_TIME',
          level: 1,
          children: []
        };
      });

    return {
      composition: rootComposition,
      reference: null,
      referenceType: 'ROOT',
      level: 0,
      children
    };
  }

}