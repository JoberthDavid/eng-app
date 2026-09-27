export interface Budget {
  id: string;
  projectId: string;
  referenceDate: string;
  methodology: 'SC' | 'SN';
  typeSystem: 'ON' | 'DS' | 'NA';
  status: string;
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
  referenceDate: string;
  factor: number;
}