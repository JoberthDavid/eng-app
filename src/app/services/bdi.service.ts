import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Bdi } from '../models/bdi.model';

@Injectable({
  providedIn: 'root'
})
export class BdiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8002';

  getBdis(): Observable<Bdi[]> {
    return this.http.get<Bdi[]>(`${this.apiUrl}/bdi`);
  }
}