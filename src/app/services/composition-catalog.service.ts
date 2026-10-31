import { Injectable, inject } from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';


export interface CompositionCatalogData {
  id: number;
  code: string;
  description: string;
  unit: string;
  fic: number;
  production: number;
}


interface CompositionCatalogApiItem {
  id: number;
  composition_group: string;
  generic_item: string;
  generic_description: string;
  unit: string;
  fic: number | string;
  production: number | string;
}


type CompositionCatalogApiResponse =
  | CompositionCatalogApiItem[]
  | {
      results: CompositionCatalogApiItem[];
    };


@Injectable({
  providedIn: 'root'
})
export class CompositionCatalogService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://127.0.0.1:8000';


  getCompositionByCode(
    code: string,
    referenceDate: string
  ): Observable<CompositionCatalogData> {

    const params =
      new HttpParams()
        .set(
          'generic_item__code__in',
          code.trim()
        )
        .set(
          'data_base',
          referenceDate.trim()
        );


    return new Observable(
      subscriber => {

        this.http
          .get<CompositionCatalogApiResponse>(
            `${this.apiUrl}/api/integrations/` +
            `scraper/buscar-composicoes/`,
            { params }
          )
          .subscribe({

            next: response => {

              const results =
                Array.isArray(response)
                  ? response
                  : response.results;


              const item = results[0];


              if (!item) {

                subscriber.error(
                  new Error(
                    `Composição não encontrada: ` +
                    `${code} / ${referenceDate}`
                  )
                );

                return;
              }


              subscriber.next({

                id: item.id,

                code: item.generic_item,

                description: item.generic_description,

                unit: item.unit,

                fic: Number(item.fic),

                production: Number(item.production)

              });

              subscriber.complete();

            },

            error: error => {

              subscriber.error(error);

            }

          });

      }

    );

  }

}