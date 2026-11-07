import {
  TestBed
} from '@angular/core/testing';

import {
  provideHttpClient
} from '@angular/common/http';

import {
  provideHttpClientTesting,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  NerStationService
} from './ner-station.service';


describe('NerStationService', () => {

  let service: NerStationService;
  let httpMock: HttpTestingController;

  const endpoint =
    'http://127.0.0.1:8000/api/integrations/budget-engine/listar-estacoes-pluviometricas/';


  beforeEach(() => {

    TestBed.configureTestingModule({

      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]

    });

    service = TestBed.inject(NerStationService);

    httpMock = TestBed.inject(HttpTestingController);

  });


  afterEach(() => {

    httpMock.verify();

  });


  it('deve ser criado', () => {

    expect(service).toBeTruthy();

  });


  it('deve consultar as estações pelo Manifold API', () => {

    const mockStations = [

      {
        id: 26,
        code: '1547004',
        name: 'Brasília',
        municipality: 'Brasília',
        state: 'DF',
        operator: 'INMET',
        latitude: '-15.790000',
        longitude: '-47.922778',
        nd: '0.025430',
        nere: '4.30',
        norm_reference: 'DNIT 182/2018 - PRO'
      }

    ];

    service.getStations().subscribe(stations => {

      expect(stations.length).toBe(1);

      expect(stations[0].code).toBe('1547004');

      expect(stations[0].nere).toBe('4.30');

    });


    const request = httpMock.expectOne(endpoint);

    expect(request.request.method).toBe('GET');

    request.flush(mockStations);

  });

});