import { TestBed } from '@angular/core/testing';

import {
  provideHttpClient
} from '@angular/common/http';

import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import {
  Bdi,
  BdiCreateRequest,
  BdiMethod
} from '../models/bdi.model';

import { BdiService } from './bdi.service';


describe('BdiService', () => {

  let service: BdiService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://127.0.0.1:8000/api/integrations/budget-engine';

  const mockMethod: BdiMethod = {
    id: 1,
    method: 'Lei 14.133/2021'
  };

  const mockBdi: Bdi = {
    id: 1,
    name: 'BDI padrão',
    slug: 'bdi-padrao',
    method: mockMethod,
    observation: 'BDI de referência',
    quotas: [
      {
        id: 1,
        group: 'A',
        description: 'Administração Central',
        percentage: 3.00,
        variable: 'AC',
        base: 'CD'
      }
    ]
  };

  const mockRequest: BdiCreateRequest = {
    name: 'BDI padrão',
    slug: 'bdi-padrao',
    method_id: 1,
    observation: 'BDI de referência',
    quotas: [
      {
        group: 'A',
        description: 'Administração Central',
        percentage: 3.00,
        variable: 'AC',
        base: 'CD'
      }
    ]
  };


  beforeEach(() => {

    TestBed.configureTestingModule({

      providers: [
        BdiService,

        provideHttpClient(),

        provideHttpClientTesting()
      ]

    });

    service = TestBed.inject(BdiService);

    httpMock = TestBed.inject(HttpTestingController);

  });


  afterEach(() => {

    httpMock.verify();

  });


  it('deve ser criado', () => {

    expect(service).toBeTruthy();

  });


  it('deve consultar a lista de BDIs', () => {

    service.getBdis().subscribe(response => {

      expect(response.length).toBe(1);

      expect(response[0].name).toBe('BDI padrão');

    });

    const req = httpMock.expectOne(`${apiUrl}/listar-bdis/`);

    expect(req.request.method).toBe('GET');

    req.flush([mockBdi]);

  });


  it('deve consultar um BDI pelo identificador', () => {

    service.getBdi(1).subscribe(response => {

      expect(response.id).toBe(1);

      expect(response.name).toBe('BDI padrão');

    });

    const req = httpMock.expectOne(`${apiUrl}/consultar-bdi/?bdi_id=1`);

    expect(req.request.method).toBe('GET');

    req.flush(mockBdi);

  });


  it('deve consultar os métodos de BDI', () => {

    service.getBdiMethods().subscribe(response => {

      expect(response.length).toBe(1);

      expect(response[0].method).toBe('Lei 14.133/2021');

    });

    const req = httpMock.expectOne(`${apiUrl}/listar-metodos-bdi/`);

    expect(req.request.method).toBe('GET');

    req.flush([mockMethod]);

  });


  it('deve criar um BDI com suas quotas', () => {

    service.createBdi(mockRequest).subscribe(response => {

      expect(response.id).toBe(1);

      expect(response.name).toBe('BDI padrão');

      expect(response.quotas.length).toBe(1);

    });

    const req = httpMock.expectOne(`${apiUrl}/criar-bdi/`);

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual(mockRequest);

    req.flush(mockBdi);

  });


  it('deve atualizar integralmente um BDI', () => {

    const updateRequest = {
      ...mockRequest,
      name: 'BDI atualizado',
      slug: 'bdi-atualizado'
    };

    const updatedBdi: Bdi = {
      ...mockBdi,
      name: 'BDI atualizado',
      slug: 'bdi-atualizado'
    };

    service.updateBdi(1, updateRequest).subscribe(response => {

      expect(response.id).toBe(1);

      expect(response.name).toBe('BDI atualizado');

    });

    const req = httpMock.expectOne(`${apiUrl}/atualizar-bdi/?bdi_id=1`);

    expect(req.request.method).toBe('PUT');

    expect(req.request.body).toEqual(updateRequest);

    req.flush(updatedBdi);

  });


  it('deve excluir um BDI', () => {

    service.deleteBdi(1).subscribe(response => {

      expect(response).toBeNull();

    });

    const req = httpMock.expectOne(`${apiUrl}/excluir-bdi/?bdi_id=1`);

    expect(req.request.method).toBe('DELETE');

    req.flush(null);

  });

});
