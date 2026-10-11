import {
  CompositionCatalogItem,
  CompositionReference
} from './budget.model';

export type CompositionReferenceType =
  | 'ROOT'
  | 'AUXILIARY'
  | 'FIXED_TIME';

export interface CompositionTreeNode {
  composition: CompositionCatalogItem;
  reference: CompositionReference | null;
  referenceType: CompositionReferenceType;
  level: number;
  children: CompositionTreeNode[];
}