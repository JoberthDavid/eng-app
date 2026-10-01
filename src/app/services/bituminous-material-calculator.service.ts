import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  BituminousMaterial,
  BituminousOrigin
} from '../models/bituminous-material.models';

@Injectable({
  providedIn: 'root'
})
export class BituminousMaterialCalculatorService {

  private readonly apiUrl = '/api/v1/bituminous-materials';

  constructor(
    private readonly http: HttpClient
  ) {}

  getMaterials(): Observable<BituminousMaterial[]> {
    return this.http.get<BituminousMaterial[]>(
      this.apiUrl
    );
  }

  getMaterial(
    code: string
  ): Observable<BituminousMaterial> {
    return this.http.get<BituminousMaterial>(
      `${this.apiUrl}/${encodeURIComponent(code)}`
    );
  }

  calculate(
    origin: BituminousOrigin
  ): Observable<BituminousOrigin> {
    return this.http.post<BituminousOrigin>(
      `${this.apiUrl}/calculate`,
      origin
    );
  }
}