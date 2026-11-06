export interface BdiMethod {
  id: number;
  method: string;
}

export interface BdiQuota {
  id: number;
  group: string;
  description: string;
  percentage: number;
  variable: string;
  base: 'CD' | 'PV';
}

export interface Bdi {
  id: number;
  name: string;
  slug: string;
  method: BdiMethod;
  observation: string;
  quotas: BdiQuota[];
}

export interface BdiRow {
  id: number;
  group: string;
  description: string;
  variable: string;
  base: 'CD' | 'PV';
  parameter: number;
  pvPercent: number;
  cdPercent: number;
}

export interface BdiGroupTotal {
  group: string;
  pvPercent: number;
  cdPercent: number;
}

export interface BdiQuotaInput {
  group: string;
  description: string;
  percentage: number;
  variable: string;
  base: 'CD' | 'PV';
}

export interface BdiCreateRequest {
  name: string;
  slug: string;
  method_id: number;
  observation?: string;
  quotas: BdiQuotaInput[];
}

export type BdiUpdateRequest = BdiCreateRequest;