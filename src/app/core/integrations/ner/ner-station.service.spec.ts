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

import {
  NerCalculationRequest,
  NerCalculationResponse,
  PluviometricStationResponse
} from './ner-station.models';


describe('NerStationService', () => {

  let service: NerStationService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://127.0.0.1:8000';

  const stationsEndpoint =
    `${baseUrl}/api/integrations/budget-engine/listar-estacoes-pluviometricas/`;

  const calculationEndpoint =
    `${baseUrl}/api/integrations/budget-engine/criar-calculo-ner/`;


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

    const mockStations: PluviometricStationResponse[] = [

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

    const request = httpMock.expectOne(stationsEndpoint);

    expect(request.request.method).toBe('GET');

    request.flush(mockStations);

  });


  it('deve enviar uma solicitação de cálculo NER pelo Manifold API', () => {

    const payload: NerCalculationRequest = {

      latitude: -16.601,
      longitude: -49.264,
      station_count: 5,
      adjustment: 0,
      location_name: 'Teste integração NER',
      location_description: 'Teste automatizado do serviço'

    };

    const mockResponse: NerCalculationResponse = {

      id: 1,

      location: {
        id: 1,
        name: 'Teste integração NER',
        description: 'Teste automatizado do serviço',
        latitude: '-16.601000',
        longitude: '-49.264000'
      },

      station_count: 5,
      calculation_method: 'INVERSE_DISTANCE',
      weighted_nere: '4.211718',
      nerp: 4,
      adjustment: 0,
      ner: 4,
      sum_weighted_nere: '0.121658754416',
      sum_weights: '0.028885781416',
      norm_reference: 'DNIT 182/2018 - PRO',
      calculated_at: '2026-11-09T18:22:09.263056Z',

      stations: [
        {
          station_id: 27,
          sequence: 1,
          station_code: '1750001',
          station_name: 'Fazenda do Turno',
          latitude: '-17.079167',
          longitude: '-50.289444',
          nere: '4.30',
          nd: '0.025200',
          distance_km: '121.397040',
          weight: '0.008237433137',
          weighted_nere: '0.035420962489'
        }
      ]

    };

    service.createCalculation(payload).subscribe(response => {

      expect(response.id).toBe(1);
      expect(response.ner).toBe(4);
      expect(response.nerp).toBe(4);
      expect(response.station_count).toBe(5);
      expect(response.calculation_method).toBe('INVERSE_DISTANCE');
      expect(response.stations.length).toBe(1);
      expect(response.stations[0].station_code).toBe('1750001');

    });

    const request = httpMock.expectOne(calculationEndpoint);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);

    request.flush(mockResponse);

  });

});