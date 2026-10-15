export interface Budget {
  id: string;
  projectId: string;
  methodology: 'SC' | 'SN';
  typeSystem: 'ON' | 'DS' | 'NA';
  status: string;
  highway: string;
  SNV: string[];
  totalCost: string;
  services: ServiceItem[];
}

export interface ServiceItem {
  code: string;
  description: string;
  unit: string;
  quantity: number;
  compositions: CompositionItem[];
}

export interface CompositionCatalogItem {
  code: string;
  description: string;
  referenceDate: string;
  referenceBaseDate: string,
  factor: number;

  unitCost: string;
  totalCost: string;

  auxiliaryCompositions: CompositionReference[];
  fixedTimeCompositions: CompositionReference[];

  inputs: CompositionInput[];
}

export interface CompositionItem extends CompositionCatalogItem {
  quantity: number;
}

export interface CompositionReference {
  code: string;
  description: string;
  unit: string;
  quantity: number;
}

export interface CompositionInput {
  id: number;
  inputGroup: string;
  genericItem: string;
  genericDescription: string;
  unit: string;
  inputQuantity: number;
  inputUse: number | null;
  proprietaryItem: string | null;
}

export interface EquipmentCalculationLine {
  code: string;
  description: string;
  unit: string;
  quantity: string;
  input_use: string;
  productive_value: string;
  unproductive_value: string;
  line_cost: string;
}

export interface LaborCalculationLine {
  code: string;
  description: string;
  unit: string;
  quantity: string;
  monetary_value: string;
  line_cost: string;
}

export interface MaterialCalculationLine {
  code: string;
  description: string;
  unit: string;
  quantity: string;
  monetary_value: string;
  line_cost: string;
}

export interface CompositionReferenceCalculationLine {
  group: string;
  code: string;
  description: string;
  unit: string;
  quantity: string;
  child_unit_cost: string;
  line_cost: string;
}

export interface Composition {
  code: string;
  description: string;
  referenceBaseDate: string;

  factor: number;

  unitCost: string;
  totalCost: string;

  auxiliaryCompositions: CompositionReference[];
  fixedTimeCompositions: CompositionReference[];

  inputs: CompositionInput[];
}

export interface CompositionCalculationRequest {
  composition_code: string;
  source_file_uf: string;
  type_system: 'ON' | 'DS' | 'NA';
  methodology: 'SC' | 'SN';
  monetary_base_date: string;
  reference_base_date: string;
}


export interface EquipmentLineResponse {
  code: string;
  description: string;
  unit: string;
  quantity: string;
  input_use: string;
  productive_value: string;
  unproductive_value: string;
  line_cost: string;
}

export interface LaborLineResponse {
  code: string;
  description: string;
  unit: string;
  quantity: string;
  monetary_value: string;
  line_cost: string;
}

export interface MaterialLineResponse {
  code: string;
  description: string;
  unit: string;
  quantity: string;
  monetary_value: string;
  line_cost: string;
}

export interface CompositionReferenceLineResponse {
  group: string;
  code: string;
  description: string;
  unit: string;
  quantity: string;
  child_unit_cost: string;
  line_cost: string;
}

export interface CompositionCalculationLinesResponse {
  equipment: EquipmentLineResponse[];
  labor: LaborLineResponse[];
  materials: MaterialLineResponse[];
  composition_references: CompositionReferenceLineResponse[];
}

export interface CompositionCalculationDetail {
  composition_id: string;
  reference_base_date: string;
  unit_cost: number;
  detail: CompositionCalculationLinesResponse;
}