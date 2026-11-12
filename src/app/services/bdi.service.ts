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
  Bdi,
  BdiMethod,
  BdiCreateRequest,
  BdiUpdateRequest
} from '../models/bdi.model';


const MANIFOLD_API_URL =
  'http://127.0.0.1:8000/api/integrations/budget-engine';


@Injectable({
  providedIn: 'root'
})
export class BdiService {

  private readonly http = inject(HttpClient);


  /**
   * Consulta todos os BDIs cadastrados.
   */
  getBdis(): Observable<Bdi[]> {

    return this.http.get<Bdi[]>(
      `${MANIFOLD_API_URL}/listar-bdis/`
    );

  }


  /**
   * Consulta um BDI pelo identificador.
   */
  getBdi(id: number): Observable<Bdi> {

    const params = new HttpParams()
      .set('bdi_id', id);

    return this.http.get<Bdi>(
      `${MANIFOLD_API_URL}/consultar-bdi/`,
      { params }
    );

  }


  /**
   * Consulta os métodos de cálculo de BDI.
   */
  getBdiMethods(): Observable<BdiMethod[]> {

    return this.http.get<BdiMethod[]>(
      `${MANIFOLD_API_URL}/listar-metodos-bdi/`
    );

  }


  /**
   * Cria um BDI com suas respectivas quotas.
   */
  createBdi(
    request: BdiCreateRequest
  ): Observable<Bdi> {

    return this.http.post<Bdi>(
      `${MANIFOLD_API_URL}/criar-bdi/`,
      request
    );

  }


  /**
   * Atualiza integralmente um BDI.
   */
  updateBdi(
    id: number,
    request: BdiUpdateRequest
  ): Observable<Bdi> {

    const params = new HttpParams()
      .set('bdi_id', id);

    return this.http.put<Bdi>(
      `${MANIFOLD_API_URL}/atualizar-bdi/`,
      request,
      { params }
    );

  }


  /**
   * Exclui um BDI.
   */
  deleteBdi(
    id: number
  ): Observable<void> {

    const params = new HttpParams()
      .set('bdi_id', id);

    return this.http.delete<void>(
      `${MANIFOLD_API_URL}/excluir-bdi/`,
      { params }
    );

  }

}