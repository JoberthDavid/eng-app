import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  PluviometricStationResponse
} from './ner-station.models';


const MANIFOLD_API_URL = 'http://127.0.0.1:8000';

const NER_STATIONS_ENDPOINT =
  '/api/integrations/budget-engine/listar-estacoes-pluviometricas/';


@Injectable({
  providedIn: 'root'
})
export class NerStationService {

  private readonly http = inject(HttpClient);


  /**
   * Consulta o cadastro oficial de estações
   * pluviométricas mantido pelo budget-engine.
   *
   * A comunicação ocorre exclusivamente
   * através do Manifold API.
   */
  getStations(): Observable<PluviometricStationResponse[]> {

    return this.http.get<PluviometricStationResponse[]>(
      `${MANIFOLD_API_URL}${NER_STATIONS_ENDPOINT}`
    );

  }

}