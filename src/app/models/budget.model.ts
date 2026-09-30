export interface Budget {
  id: string;
  projectId: string;
  referenceDate: string;
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

export interface CompositionItem {
  code: string;
  description: string;
  referenceDate: string;
  factor: number;

  unitCost: string;
  totalCost: string;

  auxiliaryCompositions: CompositionReference[];
  fixedTimeCompositions: CompositionReference[];

  inputs: CompositionInput[];
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