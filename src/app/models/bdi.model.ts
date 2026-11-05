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
}

export interface Bdi {
  id: number;
  name: string;
  slug: string;
  method: BdiMethod;
  quotas: BdiQuota[];
}