export type AbcClass = 'A' | 'B' | 'C';

export interface AbcCompositionItem {
  code: string;
  description: string;
  unit: string;

  quantity: string;
  factor: string;

  unitCost: string;
  totalCost: string;

  participation: string;
  accumulatedParticipation: string;

  classification: AbcClass;
}

export interface AbcCompositionResult {
  budgetId: string;
  referenceDate: string;

  totalCost: string;
  compositionCount: string;

  classACount: string;
  classBCount: string;
  classCCount: string;

  classAParticipation: string;
  classBParticipation: string;
  classCParticipation: string;

  items: AbcCompositionItem[];
}