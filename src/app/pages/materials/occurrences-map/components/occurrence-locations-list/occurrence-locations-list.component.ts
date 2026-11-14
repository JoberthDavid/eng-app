import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  OccurrenceMaterial,
  OccurrenceNature,
  OccurrenceSupplier,
  SupplierLocation
} from '../../../../../models/occurrence.models';

export interface OccurrenceLocationFilters {
  searchTerm: string;
  selectedState: string;
  selectedMunicipality: string;
  selectedSupplier: string;
  selectedMaterial: string;
  selectedNature: string;
  selectedStatus: string;
}

@Component({
  selector: 'app-occurrence-locations-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './occurrence-locations-list.component.html',
  styleUrl: './occurrence-locations-list.component.scss'
})
export class OccurrenceLocationsListComponent implements OnChanges {

  /**
   * Locais já filtrados pelo componente pai.
   */
  @Input()
  locations: SupplierLocation[] = [];

  /**
   * Todos os locais, utilizados nos indicadores e filtros auxiliares.
   */
  @Input()
  allLocations: SupplierLocation[] = [];

  @Input()
  suppliers: OccurrenceSupplier[] = [];

  @Input()
  selectedLocationId: number | null = null;

  @Input()
  loading = false;

  @Input()
  errorMessage: string | null = null;

  /**
   * Opções dos filtros recebidas do componente pai.
   */
  @Input()
  states: string[] = [];

  @Input()
  municipalities: string[] = [];

  @Input()
  materials: OccurrenceMaterial[] = [];

  @Input()
  natures: OccurrenceNature[] = [];

  /**
   * Valores dos filtros controlados pelo componente pai.
   */
  @Input()
  searchTerm = '';

  @Input()
  selectedState = '';

  @Input()
  selectedMunicipality = '';

  @Input()
  selectedSupplier = '';

  @Input()
  selectedMaterial = '';

  @Input()
  selectedNature = '';

  @Input()
  selectedStatus = 'all';

  /**
   * Comunicação com o componente pai.
   */
  @Output()
  filtersChange = new EventEmitter<OccurrenceLocationFilters>();

  @Output()
  locationSelected = new EventEmitter<SupplierLocation>();

  /**
   * Paginação local da tabela.
   */
  currentPage = 1;
  pageSize = 10;

  readonly pageSizes = [10, 25, 50];
  readonly Math = Math;

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['locations']) {
      this.currentPage = 1;
    }

    if (changes['selectedLocationId']) {
      this.ensureSelectedLocationVisible();
    }
  }

  /**
   * Os locais recebidos já estão filtrados pelo componente pai.
   */
  get filteredLocations(): SupplierLocation[] {
    return this.locations;
  }

  get paginatedLocations(): SupplierLocation[] {

    const start = (this.currentPage - 1) * this.pageSize;

    return this.filteredLocations.slice(
      start,
      start + this.pageSize
    );
  }

  get totalPages(): number {

    return Math.max(
      1,
      Math.ceil(this.filteredLocations.length / this.pageSize)
    );
  }

  /**
   * Indicadores calculados sobre todos os locais.
   */
  get totalLocations(): number {
    return this.allLocations.length;
  }

  get activeLocations(): number {
    return this.allLocations.filter(
      item => item.active
    ).length;
  }

  get georeferencedLocations(): number {
    return this.allLocations.filter(
      location => this.hasCoordinates(location)
    ).length;
  }

  get withoutCoordinates(): number {
    return this.totalLocations - this.georeferencedLocations;
  }

  /**
   * Identifica o fornecedor de um local.
   */
  getSupplier(supplierId: number): OccurrenceSupplier | undefined {

    return this.suppliers.find(
      supplier => supplier.id === supplierId
    );
  }

  getSupplierName(supplierId: number): string {

    const supplier = this.getSupplier(supplierId);

    return supplier?.trade_name ||
      supplier?.legal_name ||
      `Fornecedor #${supplierId}`;
  }

  /**
   * Formata o endereço do local.
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
   * Verifica se as coordenadas são válidas.
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
   * Formata as coordenadas geográficas.
   */
  formatCoordinates(location: SupplierLocation): string {

    if (!this.hasCoordinates(location)) {
      return 'Não informado';
    }

    return `${Number(location.latitude).toFixed(5)}, ${
      Number(location.longitude).toFixed(5)
    }`;
  }

  /**
   * Emite os filtros atualizados para o componente pai.
   */
  applyFilters(): void {

    this.currentPage = 1;

    this.filtersChange.emit({
      searchTerm: this.searchTerm,
      selectedState: this.selectedState,
      selectedMunicipality: this.selectedMunicipality,
      selectedSupplier: this.selectedSupplier,
      selectedMaterial: this.selectedMaterial,
      selectedNature: this.selectedNature,
      selectedStatus: this.selectedStatus
    });
  }

  /**
   * Solicita ao componente pai a limpeza dos filtros.
   */
  clearFilters(): void {

    this.searchTerm = '';
    this.selectedState = '';
    this.selectedMunicipality = '';
    this.selectedSupplier = '';
    this.selectedMaterial = '';
    this.selectedNature = '';
    this.selectedStatus = 'all';

    this.applyFilters();
  }

  /**
   * Altera a quantidade de registros por página.
   */
  changePageSize(value: string): void {

    this.pageSize = Number(value);
    this.currentPage = 1;
  }

  previousPage(): void {

    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  /**
   * Mantém o local selecionado visível na página atual.
   */
  private ensureSelectedLocationVisible(): void {

    if (this.selectedLocationId === null) {
      return;
    }

    const index = this.filteredLocations.findIndex(
      location => location.id === this.selectedLocationId
    );

    if (index < 0) {
      return;
    }

    const targetPage = Math.floor(index / this.pageSize) + 1;

    this.currentPage = targetPage;
  }

  /**
   * Emite o local selecionado para o componente pai.
   */
  selectLocation(location: SupplierLocation): void {
    this.locationSelected.emit(location);
  }
}