export interface PluviometricStationResponse {
  id: number;
  code: string;
  name: string;
  municipality: string;
  state: string;
  operator: string;
  latitude: string;
  longitude: string;
  nd: string | null;
  nere: string;
  norm_reference: string;
}

export interface PluviometricStation {
  id: number;
  code: string;
  name: string;
  municipality: string;
  state: string;
  operator: string;
  latitude: number;
  longitude: number;
  nd: number | null;
  nere: number;
  normReference: string;
}

export interface NerCalculationRequest {
  latitude: number;
  longitude: number;
  station_count: number;
  adjustment: number;
  location_name: string;
  location_description: string;
}

export interface NerCalculationLocationResponse {
  id: number;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
}

export interface NerCalculationStationResponse {
  station_id: number;
  sequence: number;
  station_code: string;
  station_name: string;
  latitude: string;
  longitude: string;
  nere: string;
  nd: string | null;
  distance_km: string;
  weight: string;
  weighted_nere: string;
}

export interface NerCalculationResponse {
  id: number;
  location: NerCalculationLocationResponse;
  station_count: number;
  calculation_method: string;
  weighted_nere: string;
  nerp: number;
  adjustment: number;
  ner: number;
  sum_weighted_nere: string;
  sum_weights: string;
  norm_reference: string;
  calculated_at: string;
  stations: NerCalculationStationResponse[];
}

/**
 * Representação das estações efetivamente utilizadas
 * pelo cálculo oficial, preparada para apresentação.
 *
 * Não contém município, UF ou operador porque esses
 * campos não fazem parte da resposta do cálculo.
 */
export interface NerCalculationStation {
  id: number;
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  nere: number;
  nd: number | null;
  sequence: number;
  distanceKm: number;
  weight: number;
  weightedNere: number;
}

/**
 * Modelo legado utilizado pelo componente atual.
 *
 * Será removido quando o componente passar
 * integralmente a utilizar NerCalculationStation.
 */
export interface StationCalculation
  extends PluviometricStation {
  distanceKm: number;
  weight: number;
  weightedNere: number;
  considered: boolean;
}