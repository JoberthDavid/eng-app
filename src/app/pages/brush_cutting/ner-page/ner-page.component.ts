import {
  AfterViewInit,
  Component,
  OnDestroy
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import * as L from 'leaflet';


interface PluviometricStation {
  code: string;
  name: string;
  municipality: string;
  state: string;
  latitude: number;
  longitude: number;
  nere: number;
}


interface StationCalculation extends PluviometricStation {
  distanceKm: number;
  weight: number;
  weightedNere: number;
  considered: boolean;
}


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

  /*
   * MAPA
   */
  private map?: L.Map;

  private pointMarker?: L.CircleMarker;

  private stationMarkers: L.CircleMarker[] = [];

  private stationLines: L.Polyline[] = [];

  private resizeObserver?: ResizeObserver;


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


  /*
   * MOCK TEMPORÁRIO
   *
   * Posteriormente será substituído
   * pelo endpoint do backend.
   */
  private readonly stationDatabase: PluviometricStation[] = [

    {
      code: '1547013',
      name: 'Taquara',
      municipality: 'Brasília',
      state: 'DF',
      latitude: -15.632222,
      longitude: -47.520278,
      nere: 3.6
    },

    {
      code: '1547004',
      name: 'Brasília',
      municipality: 'Brasília',
      state: 'DF',
      latitude: -15.790000,
      longitude: -47.922778,
      nere: 4.3
    },

    {
      code: '1549001',
      name: 'Goianésia',
      municipality: 'Goianésia',
      state: 'GO',
      latitude: -15.329167,
      longitude: -49.121667,
      nere: 4.4
    },

    {
      code: '1750001',
      name: 'Estação 1750001',
      municipality: 'Goiás',
      state: 'GO',
      latitude: -17.079167,
      longitude: -50.288333,
      nere: 4.3
    },

    {
      code: '1542016',
      name: 'Serra Branca',
      municipality: 'Minas Gerais',
      state: 'MG',
      latitude: -15.000000,
      longitude: -44.000000,
      nere: 3.1
    }

  ];


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

    this.latitude =
      Number(latitude.toFixed(6));

    this.longitude =
      Number(longitude.toFixed(6));


    if (!this.map) {
      return;
    }


    /*
     * Remove marcador anterior
     */

    this.pointMarker?.remove();


    /*
     * Cria novo marcador
     *
     * Círculo maior para destacar
     * o ponto escolhido pelo usuário.
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
     * Tooltip do ponto
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


    /*
     * Garante que o ponto fique
     * acima das linhas.
     */

    this.pointMarker.bringToFront();

  }


  /*
   * CÁLCULO PRINCIPAL
   */

  calculate(): void {

    if (
      this.latitude === null ||
      this.longitude === null
    ) {

      return;

    }


    /*
     * Calcula distância de todas
     * as estações ao ponto.
     */

    const calculations =
      this.stationDatabase

        .map(station => {

          const distanceKm =
            this.calculateDistanceKm(

              this.latitude!,
              this.longitude!,

              station.latitude,
              station.longitude

            );


          const weight =
            distanceKm > 0

              ? 1 / distanceKm

              : Number.MAX_SAFE_INTEGER;


          return {

            ...station,

            distanceKm,

            weight,

            weightedNere:
              station.nere * weight,

            considered: false

          };

        })

        /*
         * Ordena da estação mais próxima
         * para a mais distante.
         */

        .sort(
          (a, b) =>
            a.distanceKm - b.distanceKm
        );


    /*
     * Define quais estações serão
     * consideradas.
     */

    calculations.forEach(
      (station, index) => {

        station.considered =
          index < this.stationCount;

      }
    );


    this.stations =
      calculations;


    /*
     * Filtra as estações adotadas.
     */

    const considered =
      calculations.filter(
        station =>
          station.considered
      );


    /*
     * Soma NERE × peso
     */

    this.sumWeightedNere =
      considered.reduce(
        (sum, station) =>

          sum +
          station.weightedNere,

        0
      );


    /*
     * Soma dos pesos
     */

    this.sumWeights =
      considered.reduce(
        (sum, station) =>

          sum +
          station.weight,

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

    }


    this.calculated = true;


    /*
     * Atualiza a representação
     * espacial do cálculo.
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
      6371;


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

}