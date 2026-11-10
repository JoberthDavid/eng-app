import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  of,
  throwError
} from 'rxjs';

import {
  NerPageComponent
} from './ner-page.component';

import {
  NerStationService
} from '../../../core/integrations/ner/ner-station.service';

import {
  NerCalculationRequest,
  NerCalculationResponse
} from '../../../core/integrations/ner/ner-station.models';


describe('NerPageComponent', () => {

  let fixture: ComponentFixture<NerPageComponent>;
  let component: NerPageComponent;
  let service: jasmine.SpyObj<NerStationService>;


  const mockResponse: NerCalculationResponse = {

    id: 1,

    location: {
      id: 1,
      name: 'Teste NER',
      description: 'Teste automatizado',
      latitude: '-16.601000',
      longitude: '-49.264000'
    },

    station_count: 2,

    calculation_method: 'INVERSE_DISTANCE',

    weighted_nere: '4.211718',

    nerp: 4.21,

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
      },

      {
        station_id: 28,
        sequence: 2,
        station_code: '1549001',
        station_name: 'Goianésia',
        latitude: '-15.329167',
        longitude: '-49.121667',
        nere: '4.40',
        nd: '0.026320',
        distance_km: '142.237578',
        weight: '0.007030490916',
        weighted_nere: '0.030934160030'
      }

    ]

  };


  beforeEach(async () => {

    service = jasmine.createSpyObj<NerStationService>(
      'NerStationService',
      ['getStations', 'createCalculation']
    );

    service.createCalculation.and.returnValue(
      of(mockResponse)
    );

    await TestBed.configureTestingModule({

      imports: [
        NerPageComponent
      ],

      providers: [
        {
          provide: NerStationService,
          useValue: service
        }
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(NerPageComponent);

    component = fixture.componentInstance;

    // Não executamos detectChanges aqui:
    // os testes são unitários e não precisam
    // inicializar o mapa Leaflet.

  });


  afterEach(() => {

    fixture.destroy();

  });


  it('deve ser criado', () => {

    expect(component).toBeTruthy();

  });


  it('deve enviar os parâmetros ao Budget Engine', () => {

    component.latitude = -16.601;
    component.longitude = -49.264;

    component.stationCount = 2;
    component.adjustment = 0;

    component.calculate();

    expect(service.createCalculation).toHaveBeenCalledTimes(1);

    const payload =
      service.createCalculation.calls.mostRecent().args[0];

    expect(payload.latitude).toBe(-16.601);
    expect(payload.longitude).toBe(-49.264);
    expect(payload.station_count).toBe(2);
    expect(payload.adjustment).toBe(0);

    expect(payload.location_name).toContain('Cálculo NER');

  });


  it('deve apresentar o resultado recebido do backend', () => {

    component.latitude = -16.601;
    component.longitude = -49.264;

    component.stationCount = 2;

    component.calculate();

    expect(component.calculated).toBeTrue();

    expect(component.calculationResult?.id).toBe(1);

    expect(component.nerp).toBe(4.21);

    expect(component.ner).toBe(4);

    expect(component.stations.length).toBe(2);

    expect(component.stations[0].code).toBe('1750001');

    expect(component.stations[0].name).toBe('Fazenda do Turno');

    expect(component.stations[0].distanceKm).toBe(121.397040);

    expect(component.sumWeights).toBe(0.028885781416);

    expect(component.sumWeightedNere).toBe(0.121658754416);

  });


  it('não deve enviar cálculo com coordenadas inválidas', () => {

    component.latitude = null;
    component.longitude = -49.264;

    component.calculate();

    expect(service.createCalculation).not.toHaveBeenCalled();

    expect(component.calculated).toBeFalse();

    expect(component.calculationError).toBe(
      'Informe coordenadas geográficas válidas.'
    );

  });


  it('deve invalidar o resultado quando o ajuste mudar', () => {

    component.latitude = -16.601;
    component.longitude = -49.264;

    component.calculate();

    expect(component.calculated).toBeTrue();

    component.adjustment = 1;

    component.onAdjustmentChange();

    expect(component.calculated).toBeFalse();

    expect(component.calculationResult).toBeNull();

    expect(component.stations.length).toBe(0);

  });


  it('deve tratar falha na comunicação com o backend', () => {

    service.createCalculation.and.returnValue(
      throwError(() => new Error('Erro de comunicação'))
    );

    component.latitude = -16.601;
    component.longitude = -49.264;

    component.calculate();

    expect(component.calculated).toBeFalse();

    expect(component.calculationError).toContain(
      'Não foi possível realizar o cálculo NER'
    );

    expect(component.isCalculating).toBeFalse();

  });


});