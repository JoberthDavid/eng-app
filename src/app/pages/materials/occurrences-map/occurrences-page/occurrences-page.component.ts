import {
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { forkJoin, Subscription } from 'rxjs';

import {
  OccurrenceMaterial,
  OccurrenceNature,
  OccurrenceSupplier,
  SupplierLocation
} from '../../../../models/occurrence.models';

import { OccurrenceService } from '../../../../services/occurrence.service';

import { OccurrencesMapComponent } from '../occurrences-map.component';

import {
  OccurrenceLocationsListComponent,
  OccurrenceLocationFilters
} from '../components/occurrence-locations-list/occurrence-locations-list.component';

@Component({
  selector: 'app-occurrences-page',
  standalone: true,
  imports: [
    CommonModule,
    OccurrencesMapComponent,
    OccurrenceLocationsListComponent
  ],
  templateUrl: './occurrences-page.component.html',
  styleUrl: './occurrences-page.component.scss'
})
export class OccurrencesPageComponent implements OnInit, OnDestroy {

  private readonly service = inject(OccurrenceService);

  private dataSubscription?: Subscription;

  /**
   * Dados originais recebidos do Manifold.
   */
  locations: SupplierLocation[] = [];
  filteredLocations: SupplierLocation[] = [];
  suppliers: OccurrenceSupplier[] = [];

  /**
   * Estado da consulta.
   */
  loading = true;

  errorMessage: string | null = null;

  /**
   * Estado dos filtros compartilhados.
   */
  searchTerm = '';

  selectedState = '';

  selectedMunicipality = '';

  selectedSupplier = '';

  selectedMaterial = '';

  selectedNature = '';

  selectedStatus = 'all';

  /**
   * Controle da seleção entre mapa e tabela.
   */
  selectedLocationId: number | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  /**
   * Consulta locais e fornecedores pelo Manifold.
   */
  private loadData(): void {

    this.loading = true;
    this.errorMessage = null;

    this.dataSubscription = forkJoin({
      locations: this.service.getLocations(),
      suppliers: this.service.getSuppliers()
    }).subscribe({

      next: ({ locations, suppliers }) => {

        this.locations = locations;
        this.suppliers = suppliers;

        this.updateFilteredLocations();

        this.loading = false;
      },

      error: error => {

        console.error(
          'Erro ao carregar ocorrências:',
          error
        );

        this.errorMessage =
          'Não foi possível carregar os locais e fornecedores.';

        this.loading = false;
      }
    });
  }

  private updateFilteredLocations(): void {

    const search = this.searchTerm
      .trim()
      .toLocaleLowerCase('pt-BR');

    this.filteredLocations = this.locations.filter(location => {

      const supplier = this.getSupplier(location.supplier);
      const address = this.getAddress(location);

      const searchableText = [
        location.name,
        location.municipality,
        location.state,
        address,
        supplier?.legal_name,
        supplier?.trade_name,
        supplier?.cnpj
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('pt-BR');

      if (search && !searchableText.includes(search)) {
        return false;
      }

      if (this.selectedState && location.state !== this.selectedState) {
        return false;
      }

      if (
        this.selectedMunicipality &&
        location.municipality !== this.selectedMunicipality
      ) {
        return false;
      }

      if (
        this.selectedSupplier &&
        location.supplier !== Number(this.selectedSupplier)
      ) {
        return false;
      }

      if (
        this.selectedMaterial &&
        !location.materials?.some(
          material => material.id === Number(this.selectedMaterial)
        )
      ) {
        return false;
      }

      if (
        this.selectedNature &&
        !location.natures?.some(
          nature => nature.id === Number(this.selectedNature)
        )
      ) {
        return false;
      }

      if (this.selectedStatus === 'active' && !location.active) {
        return false;
      }

      if (this.selectedStatus === 'inactive' && location.active) {
        return false;
      }

      return true;
    });
  }

  /**
   * Indicadores gerais.
   */
  get totalLocations(): number {
    return this.locations.length;
  }

  get activeLocations(): number {
    return this.locations.filter(
      location => location.active
    ).length;
  }

  get georeferencedLocations(): number {
    return this.locations.filter(
      location => this.hasCoordinates(location)
    ).length;
  }

  get withoutCoordinates(): number {
    return this.totalLocations - this.georeferencedLocations;
  }

  get totalSuppliers(): number {
    return this.suppliers.length;
  }

  get activeSuppliers(): number {
    return this.suppliers.filter(
      supplier => supplier.active
    ).length;
  }

  /**
   * Opções dos filtros.
   */
  get states(): string[] {

    return [...new Set(
      this.locations
        .map(location => location.state)
        .filter(Boolean)
    )].sort();
  }

  get municipalities(): string[] {

    return [...new Set(
      this.locations
        .filter(location =>
          !this.selectedState ||
          location.state === this.selectedState
        )
        .map(location => location.municipality)
        .filter(Boolean)
    )].sort();
  }

  get materials(): OccurrenceMaterial[] {

    const map = new Map<number, OccurrenceMaterial>();

    this.locations.forEach(location => {

      location.materials?.forEach(material => {
        map.set(material.id, material);
      });

    });

    return [...map.values()].sort(
      (a, b) => a.description.localeCompare(b.description)
    );
  }

  get natures(): OccurrenceNature[] {

    const map = new Map<number, OccurrenceNature>();

    this.locations.forEach(location => {

      location.natures?.forEach(nature => {
        map.set(nature.id, nature);
      });

    });

    return [...map.values()].sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }

  /**
   * Localiza um fornecedor.
   */
  getSupplier(supplierId: number): OccurrenceSupplier | undefined {

    return this.suppliers.find(
      supplier => supplier.id === supplierId
    );
  }

  /**
   * Formata o endereço de um local.
   */
  getAddress(location: SupplierLocation): string {

    return [
      location.street,
      location.number,
      location.complement,
      location.neighborhood
    ]
      .filter(Boolean)
      .join(', ');
  }

  /**
   * Verifica coordenadas geográficas válidas.
   */
  hasCoordinates(location: SupplierLocation): boolean {

    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);

    return (
      location.latitude !== null &&
      location.longitude !== null &&
      location.latitude !== '' &&
      location.longitude !== '' &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  /**
   * Recebe alterações dos filtros da listagem.
   */
  onFiltersChange(filters: OccurrenceLocationFilters): void {

    this.searchTerm = filters.searchTerm;
    this.selectedState = filters.selectedState;
    this.selectedMunicipality = filters.selectedMunicipality;
    this.selectedSupplier = filters.selectedSupplier;
    this.selectedMaterial = filters.selectedMaterial;
    this.selectedNature = filters.selectedNature;
    this.selectedStatus = filters.selectedStatus;

    this.updateFilteredLocations();
    this.validateSelectedLocation();
  }

  /**
   * Recebe seleção originada na tabela.
   */
  onLocationSelected(location: SupplierLocation): void {

    this.selectedLocationId = location.id;
  }

  /**
   * Recebe seleção originada no mapa.
   */
  onMarkerSelected(locationId: number): void {

    this.selectedLocationId = locationId;
  }

  /**
   * Limpa a seleção caso ela deixe de pertencer
   * ao conjunto de locais filtrados.
   */
  private validateSelectedLocation(): void {

    if (this.selectedLocationId === null) {
      return;
    }

    const stillVisible = this.filteredLocations.some(
      location => location.id === this.selectedLocationId
    );

    if (!stillVisible) {
      this.selectedLocationId = null;
    }
  }
}