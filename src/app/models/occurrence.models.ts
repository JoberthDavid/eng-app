/**
 * Tipos utilizados na apresentação do mapa.
 */
export type OccurrenceType =
  | 'PEDREIRA'
  | 'AREAL'
  | 'JAZIDA'
  | 'USINA'
  | 'CANTEIRO';

export interface MaterialOccurrence {
  id: string;
  name: string;
  type: OccurrenceType;
  material: string;
  supplier: string;
  latitude: number;
  longitude: number;
  kilometer?: string;
  distanceToProject?: string;
  transportCode?: string;
  source: 'MANUAL' | 'DNIT' | 'SIGMINE' | 'API';
  active: boolean;
}

/**
 * Contratos de leitura da API Budget Engine.
 *
 * Os tipos numéricos das coordenadas aceitam string ou number
 * para acomodar a serialização de campos Decimal do Django REST Framework.
 */

export interface OccurrenceSupplier {
  id: number;
  legal_name: string;
  trade_name: string | null;
  cnpj: string | null;
  phone: string | null;
  email: string | null;
  legal_representative: string | null;
  representative_email: string | null;
  representative_phone: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OccurrenceMaterial {
  id: number;
  code: string;
  description: string;
  unit: string;
  active: boolean;
}

export interface OccurrenceNature {
  id: number;
  code: string;
  name: string;
}

export interface SupplierLocation {
  id: number;
  supplier: number;
  name: string;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  municipality: string;
  state: string;
  postal_code: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  source: string;
  external_reference: string | null;
  active: boolean;
  nature_ids?: number[];
  material_ids?: number[];
  materials: OccurrenceMaterial[];
  natures: OccurrenceNature[];
  created_at: string;
  updated_at: string;
}

/**
 * Filtros aceitos pela operação list-locations.
 */
export interface OccurrenceLocationFilters {
  supplier_id?: number;
  state?: string;
  municipality?: string;
  material_id?: number;
  nature_id?: number;
  material_status?: 'all' | 'active' | 'inactive';
}
