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
  Bdi,
  BdiMethod,
  BdiCreateRequest,
  BdiUpdateRequest
} from '../models/bdi.model';


@Injectable({
  providedIn: 'root'
})
export class BdiService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://127.0.0.1:8002';


  getBdis(): Observable<Bdi[]> {

    return this.http.get<Bdi[]>(
      `${this.apiUrl}/bdi`
    );

  }


  getBdi(id: number): Observable<Bdi> {

    return this.http.get<Bdi>(
      `${this.apiUrl}/bdi/${id}`
    );

  }


  getBdiMethods(): Observable<BdiMethod[]> {

    return this.http.get<BdiMethod[]>(
      `${this.apiUrl}/bdi/methods`
    );

  }


  createBdi(
    request: BdiCreateRequest
  ): Observable<Bdi> {

    return this.http.post<Bdi>(
      `${this.apiUrl}/bdi`,
      request
    );

  }


  updateBdi(
    id: number,
    request: BdiUpdateRequest
  ): Observable<Bdi> {

    return this.http.put<Bdi>(
      `${this.apiUrl}/bdi/${id}`,
      request
    );

  }


  deleteBdi(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/bdi/${id}`
    );

  }

}