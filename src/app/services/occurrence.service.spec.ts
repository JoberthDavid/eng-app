import { TestBed } from '@angular/core/testing';

import {
  provideHttpClient
} from '@angular/common/http';

import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import {
  OccurrenceLocationFilters,
  OccurrenceSupplier,
  SupplierLocation
} from '../models/occurrence.models';

import { OccurrenceService } from './occurrence.service';


describe('OccurrenceService', () => {

  let service: OccurrenceService;
  let httpMock: HttpTestingController;

  const apiUrl =
    'http://127.0.0.1:8000/api/integrations/budget-engine';


  const mockLocation: SupplierLocation = {
    id: 1,
    supplier: 1,
    name: 'Pedreira Teste',
    street: 'Rodovia GO-020',
    number: null,
    complement: null,
    neighborhood: null,
    municipality: 'Goiânia',
    state: 'GO',
    postal_code: null,
    latitude: -16.6201,
    longitude: -49.2504,
    source: 'MANUAL',
    external_reference: null,
    active: true,
    materials: [
      {
        id: 1,
        code: 'BRITA-01',
        description: 'Brita 1',
        unit: 'm³',
        active: true
      }
    ],
    natures: [
      {
        id: 1,
        code: 'PED',
        name: 'Pedreira'
      }
    ],
    created_at: '2026-11-13T10:00:00Z',
    updated_at: '2026-11-13T10:00:00Z'
  };


  const mockSupplier: OccurrenceSupplier = {
    id: 1,
    legal_name: 'Fornecedor Teste LTDA',
    trade_name: 'Fornecedor Teste',
    cnpj: '00000000000100',
    phone: null,
    email: 'teste@example.com',
    legal_representative: null,
    representative_email: null,
    representative_phone: null,
    active: true,
    created_at: '2026-11-13T10:00:00Z',
    updated_at: '2026-11-13T10:00:00Z'
  };


  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        OccurrenceService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(OccurrenceService);
    httpMock = TestBed.inject(HttpTestingController);

  });


  afterEach(() => {
    httpMock.verify();
  });


  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });


  it('deve consultar locais sem filtros', () => {

    service.getLocations().subscribe(response => {
      expect(response.length).toBe(1);
      expect(response[0].name).toBe('Pedreira Teste');
    });

    const req = httpMock.expectOne(
      `${apiUrl}/list-locations/`
    );

    expect(req.request.method).toBe('GET');

    req.flush([mockLocation]);

  });


  it('deve consultar locais com todos os filtros', () => {

    const filters: OccurrenceLocationFilters = {
      supplier_id: 1,
      state: 'GO',
      municipality: 'Goiânia',
      material_id: 1,
      nature_id: 1,
      material_status: 'active'
    };

    service.getLocations(filters).subscribe(response => {
      expect(response.length).toBe(1);
      expect(response[0].id).toBe(1);
    });

    const req = httpMock.expectOne(
      request => request.url === `${apiUrl}/list-locations/`
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('supplier_id')).toBe('1');
    expect(req.request.params.get('state')).toBe('GO');
    expect(req.request.params.get('municipality')).toBe('Goiânia');
    expect(req.request.params.get('material_id')).toBe('1');
    expect(req.request.params.get('nature_id')).toBe('1');
    expect(req.request.params.get('material_status')).toBe('active');

    req.flush([mockLocation]);

  });


  it('deve consultar um local pelo identificador', () => {

    service.getLocation(1).subscribe(response => {
      expect(response.id).toBe(1);
      expect(response.name).toBe('Pedreira Teste');
    });

    const req = httpMock.expectOne(
      `${apiUrl}/get-location/?location_id=1`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockLocation);

  });


  it('deve consultar a lista de fornecedores', () => {

    service.getSuppliers().subscribe(response => {
      expect(response.length).toBe(1);
      expect(response[0].legal_name).toBe('Fornecedor Teste LTDA');
    });

    const req = httpMock.expectOne(
      `${apiUrl}/list-suppliers/`
    );

    expect(req.request.method).toBe('GET');

    req.flush([mockSupplier]);

  });


  it('deve manter o mock temporário disponível para o componente', () => {

    const occurrences = service.getAll();

    expect(occurrences.length).toBe(3);
    expect(occurrences[0].name).toBe('Pedreira Ciplan');

  });

});
