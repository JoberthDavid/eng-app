import {
  CompositionItem,
  CompositionReference
} from './budget.model';

export type CompositionReferenceType =
  | 'ROOT'
  | 'AUXILIARY'
  | 'FIXED_TIME';

export interface CompositionTreeNode {
  composition: CompositionItem;
  reference: CompositionReference | null;
  referenceType: CompositionReferenceType;
  level: number;
  children: CompositionTreeNode[];
}