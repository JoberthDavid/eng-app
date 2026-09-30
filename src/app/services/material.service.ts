import { Injectable } from '@angular/core';

import { Material } from '../models/material.model';

export interface MaterialFilters {
  searchTerm: string;
  uf: string;
  referenceDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private readonly materials: Material[] = [

    {
      code: 'MAT-001',
      description: 'Cimento Portland CP II-32',
      unit: 'kg',
      inputGroup: 'MA',
      uf: 'DF',
      referenceDate: '2026-06-01',
      referenceValue: '0,82'
    },

    {
      code: 'MAT-002',
      description: 'Areia média lavada',
      unit: 'm³',
      inputGroup: 'MA',
      uf: 'DF',
      referenceDate: '2026-06-01',
      referenceValue: '125,40'
    },

    {
      code: 'MAT-003',
      description: 'Brita 1',
      unit: 'm³',
      inputGroup: 'MA',
      uf: 'DF',
      referenceDate: '2026-06-01',
      referenceValue: '98,20'
    },

    {
      code: 'MAT-004',
      description: 'Aço CA-50 10 mm',
      unit: 'kg',
      inputGroup: 'MA',
      uf: 'DF',
      referenceDate: '2026-06-01',
      referenceValue: '6,74'
    },

    {
      code: 'MAT-005',
      description: 'Concreto usinado fck 25 MPa',
      unit: 'm³',
      inputGroup: 'MA',
      uf: 'DF',
      referenceDate: '2026-06-01',
      referenceValue: '485,00'
    }

  ];

  getAll(): Material[] {
    return this.materials;
  }

  getByCode(code: string): Material | null {
    return this.materials.find(
      material => material.code === code
    ) ?? null;
  }

  search(
    filters: MaterialFilters
  ): Material[] {

    const searchTerm =
      filters.searchTerm.trim().toLowerCase();

    return this.materials.filter(material => {

      const matchesSearch =
        !searchTerm
        ||
        material.code
          .toLowerCase()
          .includes(searchTerm)
        ||
        material.description
          .toLowerCase()
          .includes(searchTerm);

      const matchesUf =
        !filters.uf
        ||
        material.uf === filters.uf;

      const matchesReferenceDate =
        !filters.referenceDate
        ||
        material.referenceDate === filters.referenceDate;

      return (
        matchesSearch
        &&
        matchesUf
        &&
        matchesReferenceDate
      );
    });
  }
  
}