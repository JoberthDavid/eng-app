import {
  Component,
  inject
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { Material } from '../../../models/material.model';

import { MaterialService, MaterialFilters } from '../../../services/material.service';

@Component({
  selector: 'app-materials-page',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './materials-page.component.html',
  styleUrl: './materials-page.component.scss'
})
export class MaterialsPageComponent {

  private readonly materialService =
    inject(MaterialService);

  filters: MaterialFilters = {
    searchTerm: '',
    uf: '',
    referenceDate: ''
  };

  materials: Material[] =
    this.materialService.getAll();


  onSearch(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    this.filters = {
      ...this.filters,
      searchTerm: input.value
    };

    this.applyFilters();
  }


  onUfChange(
    event: Event
  ): void {

    const select =
      event.target as HTMLSelectElement;

    this.filters = {
      ...this.filters,
      uf: select.value
    };

    this.applyFilters();
  }


  onReferenceDateChange(
    event: Event
  ): void {

    const select =
      event.target as HTMLSelectElement;

    this.filters = {
      ...this.filters,
      referenceDate: select.value
    };

    this.applyFilters();
  }


  private applyFilters(): void {

    this.materials =
      this.materialService.search(
        this.filters
      );
  }


  clearFilters(): void {

    this.filters = {
      searchTerm: '',
      uf: '',
      referenceDate: ''
    };

    this.materials =
      this.materialService.getAll();
  }
}