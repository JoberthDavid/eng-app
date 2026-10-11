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
  CompositionCalculationRequest,
  CompositionCalculationResponse
} from './composition.models';


const MANIFOLD_API_URL = 'http://127.0.0.1:8000';


@Injectable({
  providedIn: 'root'
})
export class CompositionService {

  private readonly http =
    inject(HttpClient);


  calculate(
    request: CompositionCalculationRequest
  ): Observable<CompositionCalculationResponse> {

    return this.http.post<CompositionCalculationResponse>(
      `${MANIFOLD_API_URL}/api/integrations/composition-engine/calcular-composicao/`,
      request
    );
  }
}
