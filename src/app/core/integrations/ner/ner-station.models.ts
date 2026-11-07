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

export interface StationCalculation
  extends PluviometricStation {
  distanceKm: number;
  weight: number;
  weightedNere: number;
  considered: boolean;
}