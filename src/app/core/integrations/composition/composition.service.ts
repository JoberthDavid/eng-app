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
  CompositionCalculationDetailResponse,
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


  /**
   * Solicita o cálculo simples da composição.
 *
   * Este método é utilizado pelo formulário
   * de inclusão de composição no orçamento.
   */
  calculate(
    request: CompositionCalculationRequest
  ): Observable<CompositionCalculationResponse> {

    return this.http.post<CompositionCalculationResponse>(
      `${MANIFOLD_API_URL}/api/integrations/composition-engine/calcular-composicao/`,
      request
    );
  }


  /**
   * Solicita o cálculo detalhado da composição.
   *
   * O resultado contém o custo unitário e o
   * detalhamento econômico dos equipamentos,
   * mão de obra, materiais e composições referenciadas.
   */
  calculateDetail(
    request: CompositionCalculationRequest
  ): Observable<CompositionCalculationDetailResponse> {

    return this.http.post<CompositionCalculationDetailResponse>(
      `${MANIFOLD_API_URL}/api/integrations/composition-engine/calcular-detalhe-composicao/`,
      request
    );
  }

}