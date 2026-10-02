import { Injectable, inject } from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  SicroItemResponse
} from '../models/sicro.models';


@Injectable({
  providedIn: 'root'
})
export class SicroCompositionCatalogService {

  private readonly http =
    inject(HttpClient);


  private readonly apiUrl =
    'https://web-production-5eeb7.up.railway.app/itens/';


  search(
    code: string = '',
    description: string = ''
  ): Observable<SicroItemResponse> {

    let params =
      new HttpParams()
        .set('source_files', '')
        .set('code', code.trim())
        .set('descriptions', description.trim())
        .set('descriptions__group', 'CO')
        .set('limit', '20')
        .set('offset', '0');

    return this.http.get<SicroItemResponse>(
      this.apiUrl,
      { params }
    );

  }

}