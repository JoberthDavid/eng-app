import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import * as L from 'leaflet';

import {
  NerStationService
} from '../../../core/integrations/ner/ner-station.service';

import {
  PluviometricStationResponse,
  PluviometricStation,
  StationCalculation
} from '../../../core/integrations/ner/ner-station.models';

import {
  finalize
} from 'rxjs/operators';


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
  implements OnInit, AfterViewInit, OnDestroy {

  private readonly nerStationService = inject(NerStationService);

  stationsDatabase: PluviometricStation[] = [];

  stationsLoading = false;

  stationsError: string | null = null;

  /*
   * MAPA
   */
  private map?: L.Map;

  private pointMarker?: L.CircleMarker;

  private stationMarkers: L.CircleMarker[] = [];

  private stationLines: L.Polyline[] = [];

  private resizeObserver?: ResizeObserver;


  /*
   * CONSTANTES DE CÁLCULO
   */

  private readonly EARTH_RADIUS_KM = 6371;

  /*
   * Tolerância numérica para identificar
   * uma estação coincidente com o ponto.
   *
   * 1e-9 km equivale a 1 micrômetro.
   * Evita resíduos de ponto flutuante sem
   * tratar pontos geograficamente distintos
   * como coincidentes.
   */
  private readonly ZERO_DISTANCE_TOLERANCE_KM = 1e-9;

  /*
   * PONTO DE CÁLCULO
   */
  latitude: number | null = null;

  longitude: number | null = null;


  /*
   * PARÂMETROS
   */
  stationCount = 5;

  adjustment = 0;
  /**
   * Limite exploratório:
   * até 10% das estações válidas cadastradas.
   */
  readonly MAX_STATION_PERCENTAGE = 0.10;

  get maxStationCount(): number {
    return Math.floor(
      this.stationsDatabase.length * this.MAX_STATION_PERCENTAGE
    );
  }

  get stationCountOptions(): number[] {
    return Array.from(
      { length: Math.max(0, this.maxStationCount - 1) },
      (_, index) => index + 2
    );
  }

  /**
   * Cinco estações: limite superior normativo.
   * Mais de cinco: utilização exploratória.
   */
  get isAtNormativeLimit(): boolean {
    return this.stationCount === 5;
  }

  get isExploratoryCalculation(): boolean {
    return this.stationCount > 5;
  }

  /*
   * RESULTADOS
   */
  nerp: number | null = null;

  ner: number | null = null;

  sumWeightedNere = 0;

  sumWeights = 0;

  calculated = false;


  /*
   * ESTAÇÕES
   */
  stations: StationCalculation[] = [];

  ngOnInit(): void {
    this.loadStations();
  }

  private loadStations(): void {
    this.stationsLoading = true;
    this.stationsError = null;

    this.nerStationService.getStations()
      .pipe(
        finalize(() => {
          this.stationsLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          const stations = response
            .map(station => this.mapStation(station))
            .filter(station => this.isValidStation(station));

          this.stationsDatabase = stations;
          // Garante que a quantidade selecionada permaneça válida.
          if (this.stationCount > this.maxStationCount) {
            this.stationCount = this.maxStationCount;
          }
          if (this.maxStationCount < 2) {
            this.stationsError =
              'O cadastro não possui estações válidas suficientes para realizar o cálculo.';
          }
          if (stations.length < this.stationCount) {
            this.stationsError =
              `Foram carregadas ${stations.length} estações válidas. ` +
              `São necessárias pelo menos ${this.stationCount} para o cálculo.`;
          }

          if (this.isValidCoordinates(this.latitude, this.longitude)) {
            this.calculate();
          }
        },

        error: (error) => {
          console.error(
            'Erro ao carregar estações pluviométricas:',
            error
          );

          this.stationsDatabase = [];

          this.stationsError =
            'Não foi possível carregar o cadastro de estações pluviométricas.';
        }
      });
  }

  private mapStation(
    station: PluviometricStationResponse
  ): PluviometricStation {
    return {
      id: station.id,
      code: station.code,
      name: station.name,
      municipality: station.municipality,
      state: station.state,
      operator: station.operator,
      latitude: Number(station.latitude),
      longitude: Number(station.longitude),
      nd: station.nd === null ? null : Number(station.nd),
      nere: Number(station.nere),
      normReference: station.norm_reference
    };
  }

  private isValidStation(
    station: PluviometricStation
  ): boolean {
    return (
      Number.isInteger(station.id) &&
      station.code.trim().length > 0 &&
      station.name.trim().length > 0 &&
      Number.isFinite(station.latitude) &&
      Number.isFinite(station.longitude) &&
      Number.isFinite(station.nere) &&
      station.latitude >= -90 &&
      station.latitude <= 90 &&
      station.longitude >= -180 &&
      station.longitude <= 180
    );
  }

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

    this.resizeObserver?.disconnect();

    this.map?.remove();

  }


  /*
   * INICIALIZAÇÃO DO MAPA
   */

  private initializeMap(): void {

    this.map = L.map('ner-map', {

      center: [-15.7801, -47.9292],

      zoom: 6,

      zoomControl: true,

      scrollWheelZoom: false

    });


    /*
     * OpenStreetMap
     */

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,

        attribution:
          '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);


    /*
     * Clique no mapa
     */

    this.map.on(
      'click',
      (event: L.LeafletMouseEvent) => {

        this.setCalculationPoint(
          event.latlng.lat,
          event.latlng.lng
        );

        this.calculate();

      }
    );


    setTimeout(() => {

      this.map?.invalidateSize();

    }, 100);

  }

  /*
   * DEFINE O PONTO DE CÁLCULO
   */

    setCalculationPoint(
      latitude: number,
      longitude: number
    ): void {

      if (!this.isValidCoordinates(latitude, longitude)) {

        this.resetCalculation();

        return;

      }

      this.latitude =
        Number(latitude.toFixed(6));

      this.longitude =
        Number(longitude.toFixed(6));


      if (!this.map) {
        return;
      }


      /*
      * Remove marcador anterior.
      */

      this.pointMarker?.remove();


      /*
      * Cria novo marcador.
      */

      this.pointMarker =
        L.circleMarker(
          [
            this.latitude,
            this.longitude
          ],
          {
            radius: 9,
            weight: 3,
            fillOpacity: 1,
            color: '#18212b',
            fillColor: '#ffffff'
          }
        ).addTo(this.map);


      /*
      * Tooltip do ponto.
      */

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
   * VALIDAÇÃO DAS COORDENADAS
   */

  private isValidCoordinates(
    latitude: number | null,
    longitude: number | null
  ): boolean {

    if (
      latitude === null ||
      longitude === null ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {

      return false;

    }

    return (
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );

  }


  /*
   * VALIDAÇÃO DOS PARÂMETROS
   */

  private isValidParameters(): boolean {
    return (
      Number.isInteger(this.stationCount) &&
      this.stationCount >= 2 &&
      this.stationCount <= this.maxStationCount &&
      this.stationsDatabase.length >= this.stationCount &&
      Number.isInteger(this.adjustment) &&
      this.adjustment >= -1 &&
      this.adjustment <= 1
    );
  }


  /*
   * LIMPA RESULTADOS ANTERIORES
   */

  private resetCalculation(): void {

    this.nerp = null;

    this.ner = null;

    this.sumWeightedNere = 0;

    this.sumWeights = 0;

    this.calculated = false;

    this.stations = [];

    this.pointMarker?.remove();

    this.pointMarker = undefined;

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
   * CÁLCULO PRINCIPAL
   */

  calculate(): void {

    /*
     * Valida coordenadas.
     */

    if (
      !this.isValidCoordinates(
        this.latitude,
        this.longitude
      )
    ) {

      this.resetCalculation();

      return;

    }


    /*
     * Valida parâmetros.
     */

    if (!this.isValidParameters()) {

      this.resetCalculation();

      return;

    }


    /*
     * ETAPA 1
     *
     * Calcula distância de todas
     * as estações ao ponto.
     */

    const calculations =
      this.stationsDatabase

        .map(station => {

          const distanceKm =
            this.calculateDistanceKm(

              this.latitude!,
              this.longitude!,

              station.latitude,
              station.longitude

            );


          return {

            ...station,

            distanceKm,

            weight: 0,

            weightedNere: 0,

            considered: false

          };

        })

        /*
         * Ordena pela menor distância.
         */

        .sort(
          (a, b) =>
            a.distanceKm - b.distanceKm
        );


    /*
     * ETAPA 2
     *
     * Seleciona as estações
     * consideradas no cálculo.
     */

    calculations.forEach(
      (station, index) => {

        station.considered =
          index < this.stationCount;

      }
    );


    const considered =
      calculations.filter(
        station =>
          station.considered
      );


    /*
     * ETAPA 3
     *
     * Identifica estações coincidentes
     * com o ponto de cálculo.
     */

    const coincidentStations =
      considered.filter(
        station =>
          station.distanceKm <=
          this.ZERO_DISTANCE_TOLERANCE_KM
      );


    if (coincidentStations.length > 0) {

      /*
       * Quando existem estações
       * coincidentes, elas recebem
       * pesos iguais.
       *
       * As demais recebem peso zero.
       */

      const equalWeight =
        1 / coincidentStations.length;


      coincidentStations.forEach(
        station => {

          station.weight =
            equalWeight;

        }
      );

    } else {

      /*
       * Caso normal:
       *
       * Peso inversamente proporcional
       * à distância.
       */

      considered.forEach(
        station => {

          station.weight =
            1 / station.distanceKm;

        }
      );

    }


    /*
     * Calcula NERE × peso.
     *
     * As estações não consideradas
     * permanecem com peso zero.
     */

    calculations.forEach(
      station => {

        station.weightedNere =
          station.nere * station.weight;

      }
    );


    /*
     * Atualiza lista completa.
     */

    this.stations =
      calculations;


    /*
     * ETAPA 4
     *
     * Soma NERE × peso.
     */

    this.sumWeightedNere =
      considered.reduce(
        (sum, station) =>

          sum + station.weightedNere,

        0
      );


    /*
     * Soma dos pesos.
     */

    this.sumWeights =
      considered.reduce(
        (sum, station) =>

          sum + station.weight,

        0
      );


    /*
     * NERP
     */

    this.nerp =
      this.sumWeights > 0

        ? this.sumWeightedNere /
          this.sumWeights

        : null;


    /*
     * NER
     */

    if (this.nerp !== null) {

      const baseNer =
        Math.round(this.nerp);


      this.ner =
        Math.max(

          1,

          Math.min(

            5,

            baseNer +
            this.adjustment

          )

        );

    } else {

      this.ner = null;

    }


    this.calculated =
      this.nerp !== null &&
      this.ner !== null;


    /*
     * Atualiza representação espacial.
     */

    this.updateStationMarkers();

  }


  /*
   * ALTERAÇÃO DO NÚMERO DE ESTAÇÕES
   */

  onStationCountChange(): void {

    if (this.calculated) {

      this.calculate();

    }

  }


  /*
   * ALTERAÇÃO DO AJUSTE
   */

  onAdjustmentChange(): void {

    if (this.calculated) {

      this.calculate();

    }

  }


  /*
   * DESENHA ESTAÇÕES E LINHAS
   */

  private updateStationMarkers(): void {

    if (!this.map) {
      return;
    }


    /*
     * Remove marcadores das estações
     * desenhados anteriormente.
     */

    this.stationMarkers.forEach(
      marker => marker.remove()
    );

    this.stationMarkers = [];


    /*
     * Remove linhas anteriores.
     */

    this.stationLines.forEach(
      line => line.remove()
    );

    this.stationLines = [];


    /*
     * Não continua sem ponto.
     */

    if (
      this.latitude === null ||
      this.longitude === null
    ) {

      return;

    }


    /*
     * Somente estações adotadas
     * entram no mapa.
     */

    const adoptedStations =
      this.stations.filter(
        station =>
          station.considered
      );


    /*
     * Desenha cada estação.
     */

    adoptedStations.forEach(
      station => {

        /*
         * Marcador da estação.
         *
         * Menor que o marcador do
         * ponto de cálculo.
         */

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


        /*
         * Tooltip técnico.
         */

        marker.bindTooltip(
          `
          <strong>
            ${station.code} — ${station.name}
          </strong><br>

          ${station.municipality}
          - ${station.state}<br>

          NERE:
          ${this.formatNumber(station.nere)}<br>

          Distância:
          ${this.formatNumber(station.distanceKm)}
          km
          `,
          {
            direction: 'top'
          }
        );


        /*
         * Guarda referência
         * para futura remoção.
         */

        this.stationMarkers.push(
          marker
        );


        /*
         * Linha entre o ponto
         * de cálculo e a estação.
         */

        const line =
          L.polyline(

            [
              [
                this.latitude!,
                this.longitude!
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


        this.stationLines.push(
          line
        );

      }
    );


    /*
     * Enquadra automaticamente
     * todos os elementos.
     */

    if (adoptedStations.length > 0) {

      const bounds =
        L.latLngBounds(

          [
            [
              this.latitude,
              this.longitude
            ],

            ...adoptedStations.map(
              station => [

                station.latitude,

                station.longitude

              ] as [number, number]
            )

          ]

        );


      this.map.fitBounds(
        bounds,
        {
          padding: [40, 40],

          /*
           * Evita que o mapa dê zoom
           * excessivo quando os pontos
           * estiverem muito próximos.
           */

          maxZoom: 9
        }
      );

    }


    /*
     * Garante que o ponto de cálculo
     * fique visualmente acima das linhas.
     */

    this.pointMarker?.bringToFront();


    /*
     * E garante que as estações
     * também fiquem acima das linhas.
     */

    this.stationMarkers.forEach(
      marker =>
        marker.bringToFront()
    );

  }


  /*
   * DISTÂNCIA HAVERSINE
   */

  private calculateDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {

    const earthRadiusKm =
      this.EARTH_RADIUS_KM;


    const dLat =
      this.toRadians(
        lat2 - lat1
      );


    const dLon =
      this.toRadians(
        lon2 - lon1
      );


    const a =
      Math.sin(dLat / 2) ** 2 +

      Math.cos(
        this.toRadians(lat1)
      ) *

      Math.cos(
        this.toRadians(lat2)
      ) *

      Math.sin(dLon / 2) ** 2;


    const c =
      2 *

      Math.atan2(

        Math.sqrt(a),

        Math.sqrt(1 - a)

      );


    return (
      earthRadiusKm * c
    );

  }


  /*
   * GRAUS → RADIANOS
   */

  private toRadians(
    degrees: number
  ): number {

    return (
      degrees *
      Math.PI /
      180
    );

  }


  /*
   * FORMATAÇÃO NUMÉRICA
   */

  formatNumber(
    value: number | null,
    digits = 2
  ): string {

    if (value === null) {

      return '—';

    }


    return value.toLocaleString(
      'pt-BR',
      {

        minimumFractionDigits:
          digits,

        maximumFractionDigits:
          digits

      }
    );

  }


  /*
   * ESTAÇÕES CONSIDERADAS
   */

  get consideredStations():
    StationCalculation[] {

    return this.stations.filter(
      station =>
        station.considered
    );

  }


  /*
   * TODAS AS ESTAÇÕES
   */

  get allStations():
    StationCalculation[] {

    return this.stations;

  }


    /*
   * ALTERAÇÃO MANUAL DAS COORDENADAS
   */

  onCoordinatesChange(): void {

    if (
      !this.isValidCoordinates(
        this.latitude,
        this.longitude
      )
    ) {

      this.resetCalculation();

      return;

    }


    this.setCalculationPoint(
      this.latitude!,
      this.longitude!
    );


    this.calculate();

  }

}