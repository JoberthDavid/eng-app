export type AbcClass =
  | 'A'
  | 'B'
  | 'C';


export type AbcTab =
  | 'COMPOSITIONS'
  | 'MATERIALS'
  | 'EQUIPMENT'
  | 'LABOR';


export interface AbcSummary {

  totalCost: string;

  itemCount: string;

  /*
   * Estes campos são opcionais porque os relatórios de
   * materiais, equipamentos e mão de obra fornecidos como
   * referência não apresentam explicitamente as quantidades
   * por classe A/B/C.
   *
   * O backend poderá fornecê-las posteriormente.
   */
  classACount?: string;

  classBCount?: string;

  classCCount?: string;

  classAParticipation?: string;

  classBParticipation?: string;

  classCParticipation?: string;
}


export interface AbcCurvePoint {

  code: string;

  description: string;

  accumulatedParticipation: string;

}


// ============================================================
// COMPOSIÇÕES
// ============================================================

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


// ============================================================
// MATERIAIS
// ============================================================

export interface AbcMaterialItem {

  item: string;

  code: string;

  description: string;

  quantity: string;

  totalCost: string;

  participation: string;

  accumulatedParticipation: string;

  classification: AbcClass;
  
}


export interface AbcMaterialResult {

  budgetId: string;

  referenceDate: string;

  summary: AbcSummary;

  items: AbcMaterialItem[];
}


// ============================================================
// EQUIPAMENTOS
// ============================================================

export interface AbcEquipmentItem {

  item: string;

  code: string;

  description: string;

  productiveQuantity: string;

  unproductiveQuantity: string;

  totalHours: string;

  totalCost: string;

  participation: string;

  accumulatedParticipation: string;

  classification: AbcClass;
}


export interface AbcEquipmentResult {

  budgetId: string;

  referenceDate: string;

  summary: AbcSummary;

  items: AbcEquipmentItem[];
}


// ============================================================
// MÃO DE OBRA
// ============================================================

export interface AbcLaborItem {

  item: string;

  code: string;

  description: string;

  quantity: string;

  totalCost: string;

  participation: string;

  accumulatedParticipation: string;

  classification: AbcClass;
}


export interface AbcLaborResult {

  budgetId: string;

  referenceDate: string;

  summary: AbcSummary;

  items: AbcLaborItem[];
}