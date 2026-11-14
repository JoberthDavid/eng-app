import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

import {
  OccurrenceSupplier,
  SupplierLocation
} from '../../../models/occurrence.models';

@Component({
  selector: 'app-occurrences-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './occurrences-map.component.html',
  styleUrl: './occurrences-map.component.scss'
})
export class OccurrencesMapComponent
  implements AfterViewInit, OnChanges, OnDestroy {

  @Input()
  locations: SupplierLocation[] = [];

  @Input()
  suppliers: OccurrenceSupplier[] = [];

  @Input()
  selectedLocationId: number | null = null;

  @Input()
  loading = false;

  @Input()
  errorMessage: string | null = null;

  @Output()
  locationSelected = new EventEmitter<number>();

  private markersByLocationId =
    new Map<number, L.CircleMarker>();

  private map!: L.Map;
  private markerLayer!: L.LayerGroup;

  locationCount = 0;
  mappedLocationCount = 0;

  ngAfterViewInit(): void {
    this.createMap();
    this.renderMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['locations'] ||
      changes['suppliers']
    ) {
      this.renderMarkers();
    }

    if (changes['selectedLocationId']) {
      this.focusSelectedLocation();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  /**
   * Inicializa o mapa Leaflet.
   */
  private createMap(): void {

    this.map = L.map('map').setView(
      [-16.60, -49.25],
      10
    );

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);
  }

  /**
   * Verifica se o local possui coordenadas válidas.
   */
  private hasValidCoordinates(
    location: SupplierLocation
  ): boolean {

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
   * Renderiza os marcadores dos locais recebidos pelo componente pai.
   */
  private renderMarkers(): void {

    if (!this.map || !this.markerLayer) {
      return;
    }

    this.markerLayer.clearLayers();
    this.markersByLocationId.clear();

    this.locationCount = this.locations.length;

    this.mappedLocationCount = this.locations.filter(
      location => this.hasValidCoordinates(location)
    ).length;

    const bounds: L.LatLng[] = [];

    this.locations.forEach(location => {

      if (!this.hasValidCoordinates(location)) {
        return;
      }

      const latitude = Number(location.latitude);
      const longitude = Number(location.longitude);

      const marker = L.circleMarker(
        [latitude, longitude],
        {
          radius: 8,
          color: '#ffffff',
          weight: 2,
          fillColor: '#2563eb',
          fillOpacity: 0.9
        }
      );

      marker.bindPopup(
        this.createPopupContent(location),
        {
          autoPan: false,
          closeButton: true,
          maxWidth: 300
        }
      );

      marker.on('click', () => {
        this.locationSelected.emit(location.id);
      });

      marker.addTo(this.markerLayer);

      this.markersByLocationId.set(
        location.id,
        marker
      );

      bounds.push(
        L.latLng(latitude, longitude)
      );
    });

    if (bounds.length > 0) {

      this.map.fitBounds(
        L.latLngBounds(bounds),
        {
          padding: [30, 30],
          maxZoom: 13
        }
      );

    } else {

      this.map.setView(
        [-16.60, -49.25],
        10
      );
    }

    this.focusSelectedLocation();
  }

  /**
   * Centraliza o mapa no local selecionado
   * e abre seu popup.
   */
  private focusSelectedLocation(): void {

    if (
      !this.map ||
      this.selectedLocationId === null ||
      !this.markersByLocationId.size
    ) {
      return;
    }

    const location = this.locations.find(
      item => item.id === this.selectedLocationId
    );

    const marker = this.markersByLocationId.get(
      this.selectedLocationId
    );

    if (!location || !marker) {
      return;
    }

    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);

    if (!this.hasValidCoordinates(location)) {
      return;
    }

    const target = L.latLng(latitude, longitude);

    // Atualiza as dimensões internas do Leaflet.
    this.map.invalidateSize({
      pan: false,
      animate: false
    });

    // Centraliza o marcador.
    this.map.setView(
      target,
      14,
      {
        animate: true
      }
    );

    // Abre o popup sem deslocar o mapa.
    marker.openPopup();
  }

  /**
   * Monta o popup utilizando textContent.
   * Os dados recebidos da API não são interpretados como HTML.
   */
  private createPopupContent(
    location: SupplierLocation
  ): HTMLElement {

    const container = document.createElement('div');

    const title = document.createElement('strong');
    title.textContent = location.name;

    container.appendChild(title);

    const supplier = this.suppliers.find(
      item => item.id === location.supplier
    );

    this.appendPopupLine(
      container,
      'Fornecedor',
      supplier
        ? supplier.trade_name || supplier.legal_name
        : `Fornecedor #${location.supplier}`
    );

    this.appendPopupLine(
      container,
      'Município',
      `${location.municipality}/${location.state}`
    );

    const materials = location.materials ?? [];

    this.appendPopupLine(
      container,
      'Materiais',
      materials.length
        ? materials.map(material => material.description).join(', ')
        : 'Não informado'
    );

    const natures = location.natures ?? [];

    this.appendPopupLine(
      container,
      'Naturezas',
      natures.length
        ? natures.map(nature => nature.name).join(', ')
        : 'Não informado'
    );

    this.appendPopupLine(
      container,
      'Origem',
      location.source
    );

    return container;
  }

  /**
   * Adiciona uma linha ao popup.
   */
  private appendPopupLine(
    container: HTMLElement,
    label: string,
    value: string
  ): void {

    const line = document.createElement('div');

    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;

    const text = document.createElement('span');
    text.textContent = value;

    line.appendChild(strong);
    line.appendChild(text);

    container.appendChild(line);
  }
}