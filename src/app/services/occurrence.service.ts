import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  MaterialOccurrence,
  OccurrenceLocationFilters,
  OccurrenceSupplier,
  SupplierLocation
} from '../models/occurrence.models';


const MANIFOLD_API_URL =
  'http://127.0.0.1:8000/api/integrations/budget-engine';


@Injectable({
  providedIn: 'root'
})
export class OccurrenceService {

  private readonly http = inject(HttpClient);

  /**
   * Consulta os locais de ocorrência cadastrados.
   *
   * Operação Manifold: list-locations
   */
  getLocations(
    filters?: OccurrenceLocationFilters
  ): Observable<SupplierLocation[]> {

    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {

        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }

      });
    }

    return this.http.get<SupplierLocation[]>(
      `${MANIFOLD_API_URL}/list-locations/`,
      { params }
    );
  }


  /**
   * Consulta um local pelo identificador.
   *
   * Operação Manifold: get-location
   */
  getLocation(
    locationId: number
  ): Observable<SupplierLocation> {

    const params = new HttpParams()
      .set('location_id', locationId);

    return this.http.get<SupplierLocation>(
      `${MANIFOLD_API_URL}/get-location/`,
      { params }
    );
  }


  /**
   * Consulta os fornecedores ativos.
   *
   * Operação Manifold: list-suppliers
   */
  getSuppliers(): Observable<OccurrenceSupplier[]> {

    return this.http.get<OccurrenceSupplier[]>(
      `${MANIFOLD_API_URL}/list-suppliers/`
    );
  }


  /**
   * MOCK TEMPORÁRIO.
   *
   * Será removido na etapa de integração do componente Leaflet.
   */
  private occurrences: MaterialOccurrence[] = [

    {
      id: '1',
      name: 'Pedreira Ciplan',
      type: 'PEDREIRA',
      material: 'Brita 1',
      supplier: 'CIPLAN',
      latitude: -16.6201,
      longitude: -49.2504,
      kilometer: 'KM 35',
      distanceToProject: '32,40 km',
      transportCode: '5914359',
      source: 'MANUAL',
      active: true
    },

    {
      id: '2',
      name: 'Areal Lemos',
      type: 'AREAL',
      material: 'Areia média',
      supplier: 'AREAL LEMOS',
      latitude: -16.6802,
      longitude: -49.1601,
      kilometer: 'KM 58',
      distanceToProject: '21,70 km',
      transportCode: '5914374',
      source: 'MANUAL',
      active: true
    },

    {
      id: '3',
      name: 'Usina Asfáltica GO',
      type: 'USINA',
      material: 'CAP 50/70',
      supplier: 'USINA XYZ',
      latitude: -16.7400,
      longitude: -49.2000,
      kilometer: 'KM 80',
      distanceToProject: '45,20 km',
      transportCode: '5914389',
      source: 'MANUAL',
      active: true
    }

  ];


  /**
   * Compatibilidade temporária com o componente atual.
   */
  getAll(): MaterialOccurrence[] {
    return this.occurrences;
  }

}
