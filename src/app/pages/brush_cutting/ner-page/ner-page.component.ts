import {
  AfterViewInit,
  Component,
  OnDestroy,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Subscription,
  finalize
} from 'rxjs';

import * as L from 'leaflet';

import {
  NerStationService
} from '../../../core/integrations/ner/ner-station.service';

import {
  NerCalculationRequest,
  NerCalculationResponse,
  NerCalculationStation
} from '../../../core/integrations/ner/ner-station.models';


@Component({
  selector: 'app-ner-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './ner-page.component.html',
  styleUrl: './ner-page.component.scss'
})
export class NerPageComponent
  implements AfterViewInit, OnDestroy {

  private readonly nerStationService =
    inject(NerStationService);

  /*
   * MAPA
   */

  private map?: L.Map;

  private pointMarker?: L.CircleMarker;

  private stationMarkers: L.CircleMarker[] = [];

  private stationLines: L.Polyline[] = [];

  private resizeObserver?: ResizeObserver;


  /*
   * CONTROLE DA REQUISIÇÃO
   */

  private calculationSubscription?: Subscription;

  isCalculating = false;

  calculationError: string | null = null;


  /*
   * PONTO DE CÁLCULO
   */

  latitude: number | null = null;

  longitude: number | null = null;


  /*
   * PARÂMETROS NORMATIVOS
   */

  stationCount = 5;

  adjustment = 0;

  readonly stationCountOptions = [2, 3, 4, 5];


  /*
   * RESULTADO OFICIAL
   */

  calculationResult: NerCalculationResponse | null = null;

  stations: NerCalculationStation[] = [];


  /*
   * CICLO DE VIDA
   */

  ngAfterViewInit(): void {

    this.initializeMap();

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 100);

    const container =
      document.getElementById('ner-map');

    if (container) {

      this.resizeObserver =
        new ResizeObserver(() => {
          this.map?.invalidateSize();
        });

      this.resizeObserver.observe(container);
    }
  }


  ngOnDestroy(): void {

    this.calculationSubscription?.unsubscribe();

    this.resizeObserver?.disconnect();

    this.map?.remove();
  }


  /*
   * MAPA
   */

  private initializeMap(): void {

    this.map = L.map('ner-map', {
      center: [-15.7801, -47.9292],
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: false
    });

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);

    this.map.on(
      'click',
      (event: L.LeafletMouseEvent) => {

        this.setCalculationPoint(
          event.latlng.lat,
          event.latlng.lng
        );

        this.invalidateCalculation();
      }
    );

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 100);
  }


  /*
   * DEFINIÇÃO DO PONTO
   */

  private setCalculationPoint(
    latitude: number,
    longitude: number
  ): void {

    this.latitude = Number(latitude.toFixed(6));

    this.longitude = Number(longitude.toFixed(6));

    this.pointMarker?.remove();

    if (!this.map) {
      return;
    }

    this.pointMarker =
      L.circleMarker(
        [
          latitude,
          longitude
        ],
        {
          radius: 9,
          weight: 3,
          fillOpacity: 1,
          color: '#18212b',
          fillColor: '#ffffff'
        }
      ).addTo(this.map);

    this.pointMarker.bindTooltip(
      `
      <strong>Ponto de cálculo</strong><br>
      Latitude: ${this.latitude}<br>
      Longitude: ${this.longitude}
      `,
      {
        direction: 'top'
      }
    );

    this.pointMarker.bringToFront();
  }


  /*
   * VALIDAÇÃO
   */

  private isValidCoordinates(): boolean {

    if (
      this.latitude === null ||
      this.longitude === null ||
      !Number.isFinite(this.latitude) ||
      !Number.isFinite(this.longitude)
    ) {
      return false;
    }

    return (
      this.latitude >= -90 &&
      this.latitude <= 90 &&
      this.longitude >= -180 &&
      this.longitude <= 180
    );
  }


  private isValidParameters(): boolean {

    return (
      Number.isInteger(this.stationCount) &&
      this.stationCount >= 2 &&
      this.stationCount <= 5 &&
      Number.isInteger(this.adjustment) &&
      this.adjustment >= -1 &&
      this.adjustment <= 1
    );
  }


  /*
   * INVALIDAÇÃO DO RESULTADO
   *
   * Qualquer alteração nos parâmetros
   * invalida o resultado anteriormente exibido.
   */

  private invalidateCalculation(): void {

    this.calculationSubscription?.unsubscribe();

    this.calculationSubscription = undefined;

    this.calculationResult = null;

    this.stations = [];

    this.calculationError = null;

    this.clearStationMarkers();
  }


  /*
   * LIMPEZA DOS ELEMENTOS DO MAPA
   */

  private clearStationMarkers(): void {

    this.stationMarkers.forEach(
      marker => marker.remove()
    );

    this.stationMarkers = [];

    this.stationLines.forEach(
      line => line.remove()
    );

    this.stationLines = [];
  }


  /*
   * ALTERAÇÕES DOS PARÂMETROS
   */

  onStationCountChange(): void {
    this.invalidateCalculation();
  }


  onAdjustmentChange(): void {
    this.invalidateCalculation();
  }


  onCoordinatesChange(): void {

    if (!this.isValidCoordinates()) {

      this.invalidateCalculation();

      this.pointMarker?.remove();

      this.pointMarker = undefined;

      return;
    }

    this.setCalculationPoint(
      this.latitude!,
      this.longitude!
    );

    this.invalidateCalculation();
  }


  /*
   * CÁLCULO OFICIAL
   *
   * Toda a lógica normativa é executada
   * exclusivamente pelo Budget Engine.
   */
  calculate(): void {

    if (this.isCalculating) {
      return;
    }

    this.invalidateCalculation();

    if (!this.isValidCoordinates()) {

      this.calculationError =
        'Informe coordenadas geográficas válidas.';

      return;
    }

    if (!this.isValidParameters()) {

      this.calculationError =
        'Verifique os parâmetros do cálculo.';

      return;
    }

    const payload: NerCalculationRequest = {

      latitude: this.latitude!,

      longitude: this.longitude!,

      station_count: this.stationCount,

      adjustment: this.adjustment,

      location_name:
        `Cálculo NER - ${this.latitude}, ${this.longitude}`,

      location_description:
        'Cálculo de Nível de Esforço de Roçada realizado pelo Eng-app através do Manifold API e Budget Engine.'
    };

  this.isCalculating = true;

  this.calculationSubscription =
    this.nerStationService
      .createCalculation(payload)
      .pipe(
        finalize(() => {
          this.isCalculating = false;
        })
      )
      .subscribe({

        next: (response) => {

          this.calculationResult = response;

          this.stations =
            response.stations.map(station => ({

              id: station.station_id,
              code: station.station_code,
              name: station.station_name,
              latitude: Number(station.latitude),
              longitude: Number(station.longitude),
              nere: Number(station.nere),

              nd:
                station.nd === null
                  ? null
                  : Number(station.nd),

              sequence: station.sequence,
              distanceKm: Number(station.distance_km),
              weight: Number(station.weight),
              weightedNere: Number(station.weighted_nere)

            }));

          this.updateStationMarkers();
        },

        error: (error) => {

          console.error(
            'Erro ao realizar cálculo NER:',
            error
          );

          this.calculationResult = null;
          this.stations = [];

          this.calculationError =
            'Não foi possível realizar o cálculo NER. Verifique a comunicação com o Manifold API e o Budget Engine.';
        }

      });
    };


  /*
   * REPRESENTAÇÃO ESPACIAL
   *
   * O mapa recebe exclusivamente as estações
   * devolvidas pelo cálculo oficial.
   */

  private updateStationMarkers(): void {

    if (!this.map) {
      return;
    }

    this.clearStationMarkers();

    if (
      this.latitude === null ||
      this.longitude === null
    ) {
      return;
    }

    const latitude = this.latitude;
    const longitude = this.longitude;

    this.stations.forEach(station => {

      const marker =
        L.circleMarker(
          [
            station.latitude,
            station.longitude
          ],
          {
            radius: 7,
            weight: 2,
            color: '#ffffff',
            fillColor: '#35623e',
            fillOpacity: 1
          }
        ).addTo(this.map!);

      marker.bindTooltip(
        `
        <strong>${station.code} — ${station.name}</strong><br>
        NERE: ${this.formatNumber(station.nere)}<br>
        Distância: ${this.formatNumber(station.distanceKm)} km
        `,
        {
          direction: 'top'
        }
      );

      this.stationMarkers.push(marker);

      const line =
        L.polyline(
          [
            [
              latitude,
              longitude
            ],
            [
              station.latitude,
              station.longitude
            ]
          ],
          {
            color: '#667085',
            weight: 1.5,
            dashArray: '6 6',
            opacity: 0.8
          }
        ).addTo(this.map!);

      this.stationLines.push(line);
    });

    if (this.stations.length > 0) {

      const bounds =
        L.latLngBounds([

          [
            latitude,
            longitude
          ],

          ...this.stations.map(
            station => [
              station.latitude,
              station.longitude
            ] as [number, number]
          )

        ]);

      this.map.fitBounds(
        bounds,
        {
          padding: [40, 40],
          maxZoom: 9
        }
      );
    }

    this.pointMarker?.bringToFront();

    this.stationMarkers.forEach(
      marker => marker.bringToFront()
    );
  }


  /*
   * PROPRIEDADES DE APRESENTAÇÃO
   *
   * Os valores abaixo são obtidos diretamente
   * da resposta do Budget Engine.
   */

  get calculated(): boolean {
    return this.calculationResult !== null;
  }


  get nerp(): number | null {
    return this.calculationResult?.nerp ?? null;
  }


  get ner(): number | null {
    return this.calculationResult?.ner ?? null;
  }


  get sumWeightedNere(): number {
    return Number(
      this.calculationResult?.sum_weighted_nere ?? 0
    );
  }


  get sumWeights(): number {
    return Number(
      this.calculationResult?.sum_weights ?? 0
    );
  }


  get consideredStations(): NerCalculationStation[] {
    return this.stations;
  }


  /*
   * FORMATAÇÃO
   */

  formatNumber(
    value: number | null,
    digits = 2
  ): string {

    if (value === null || !Number.isFinite(value)) {
      return '—';
    }

    return value.toLocaleString(
      'pt-BR',
      {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      }
    );
  }

}