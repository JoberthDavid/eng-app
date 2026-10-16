import { Injectable } from '@angular/core';

import {
  CompositionCatalogItem,
  CompositionReference
} from '../models/budget.model';

import {
  CompositionReferenceType,
  CompositionTreeNode
} from '../models/composition-tree.model';

@Injectable({
  providedIn: 'root'
})
export class CompositionTreeService {

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
          unitCost: this.formatUnitCost(
            Number(reference.child_unit_cost)
          ),
          totalCost: this.formatUnitCost(
            Number(reference.line_cost)
          ),
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