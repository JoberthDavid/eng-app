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


export interface CompositionCalculationDetailResponse {
  composition_id: string;
  reference_base_date: string;
  unit_cost: string;
  detail: CompositionCalculationLinesResponse;
}

export interface CompositionSectionTotals {
  equipment: number | null;
  labor: number | null;
  materials: number | null;
  auxiliaryCompositions: number | null;
  fixedTimeCompositions: number | null;
}

export interface CompositionCalculationRequest {
  composition_code: string;
  source_file_uf: string;
  type_system: 'ON' | 'DS' | 'NA';
  methodology: 'SC' | 'SN';
  monetary_base_date: string;
  reference_base_date: string;
}


export interface CompositionCalculationResponse {
  composition_id: string;
  reference_base_date: string;
  unit_cost: string;
}
