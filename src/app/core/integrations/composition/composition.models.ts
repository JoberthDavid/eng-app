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
