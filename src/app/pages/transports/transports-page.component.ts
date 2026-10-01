import {
  Component,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';


import {
  EquipmentMobilizationApplication,
  EquipmentMobilizationSummary,
  EquipmentTransporter,
  TransportApplication,
  TransportRoute,
  TransportSurface
} from '../../models/transport.models';


import {
  TransportService
} from '../../services/transport.service';


@Component({
  selector:
    'app-transports-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './transports-page.component.html',

  styleUrl:
    './transports-page.component.scss'
})
export class TransportsPageComponent {


  private readonly transportService =
    inject(TransportService);


  // ==========================================================
  // ESTADO
  // ==========================================================

  selectedSurface:
    TransportSurface =
      'PAVIMENTADO';


  search = '';


  showRouteForm = false;


  routeOrigin = '';

  routeDestination = '';

  routeDistanceKm = '';


  // ==========================================================
  // DADOS
  // ==========================================================

  routes:
    TransportRoute[] = [];

  applications:
    TransportApplication[] = [];

  mobilizations:
    EquipmentMobilizationApplication[] = [];

  equipmentTransporters:
    EquipmentTransporter[] = [];

  mobilizationSummary:
    EquipmentMobilizationSummary[] = [];


  constructor() {

    this.load();

  }


  private load(): void {

    this.routes =
      this.transportService.getRoutes();

    this.applications =
      this.transportService.getApplications();

    this.mobilizations =
      this.transportService.getMobilizations();

    this.equipmentTransporters =
      this.transportService
        .getEquipmentTransporters();

    this.mobilizationSummary =
      this.transportService
        .getMobilizationSummary();

  }


  // ==========================================================
  // SUPERFÍCIE
  // ==========================================================

  selectSurface(
    surface: TransportSurface
  ): void {

    this.selectedSurface =
      surface;

  }


  isSurface(
    surface: TransportSurface
  ): boolean {

    return (
      this.selectedSurface === surface
    );

  }


  get surfaceLabel(): string {

    switch (
      this.selectedSurface
    ) {

      case 'PAVIMENTADO':
        return 'Pavimentado';

      case 'REVESTIMENTO_PRIMARIO':
        return 'Revestimento primário';

      case 'LEITO_NATURAL':
        return 'Leito natural';

    }

  }


  // ==========================================================
  // ROTAS DA ABA
  // ==========================================================

  get visibleRoutes():
    TransportRoute[] {

    return this.transportService
      .getRoutesBySurface(
        this.selectedSurface
      );

  }


  // ==========================================================
  // APLICAÇÕES DA ABA
  // ==========================================================

  get visibleApplications():
    TransportApplication[] {

    const applications =
      this.transportService
        .getApplicationsBySurface(
          this.selectedSurface
        );


    const term =
      this.search
        .trim()
        .toLowerCase();


    if (!term) {

      return applications;

    }


    return applications.filter(
      application =>

        application.compositionCode
          .toLowerCase()
          .includes(term)

        ||

        application.transportCode
          .toLowerCase()
          .includes(term)

        ||

        application.transportDescription
          .toLowerCase()
          .includes(term)

        ||

        application.transportedItemCode
          .toLowerCase()
          .includes(term)

        ||

        application.transportedItemDescription
          .toLowerCase()
          .includes(term)

        ||

        application.origin
          .toLowerCase()
          .includes(term)

        ||

        application.destination
          .toLowerCase()
          .includes(term)

    );

  }


  // ==========================================================
  // MOBILIZAÇÕES DA ABA
  // ==========================================================

  get visibleMobilizations():
    EquipmentMobilizationApplication[] {

    return this.transportService
      .getMobilizationsBySurface(
        this.selectedSurface
      );

  }


  // ==========================================================
  // ORIGENS
  // ==========================================================

  get routeOrigins(): string[] {

    return [
      ...new Set(
        this.routes
          .filter(
            route =>
              route.surface ===
              this.selectedSurface
          )
          .map(
            route =>
              route.origin
          )
      )
    ].sort();

  }


  // ==========================================================
  // DESTINOS
  // ==========================================================

  getDestinations(
    origin: string
  ): string[] {

    if (!origin) {

      return [];

    }


    return [
      ...new Set(

        this.routes

          .filter(
            route =>

              route.surface ===
              this.selectedSurface

              &&

              this.normalize(
                route.origin
              ) ===

              this.normalize(
                origin
              )
          )

          .map(
            route =>
              route.destination
          )

      )

    ].sort();

  }


  // ==========================================================
  // DISTÂNCIA
  // ==========================================================

  getDistance(
    application:
      TransportApplication
  ): string {

    return this.transportService
      .getDistance(
        application.origin,
        application.destination,
        application.surface
      );

  }


  hasRoute(
    application:
      TransportApplication
  ): boolean {

    return this.transportService
      .hasRoute(
        application.origin,
        application.destination,
        application.surface
      );

  }


  getMobilizationDistance(
    application:
      EquipmentMobilizationApplication
  ): string {

    return this.transportService
      .getDistance(
        application.origin,
        application.destination,
        application.surface
      );

  }


  hasMobilizationRoute(
    application:
      EquipmentMobilizationApplication
  ): boolean {

    return this.transportService
      .hasRoute(
        application.origin,
        application.destination,
        application.surface
      );

  }


  // ==========================================================
  // FORMULÁRIO DE ROTA
  // ==========================================================

  openRouteForm(): void {

    this.routeOrigin = '';

    this.routeDestination = '';

    this.routeDistanceKm = '';

    this.showRouteForm = true;

  }


  cancelRouteForm(): void {

    this.showRouteForm = false;

  }


  createRoute(): void {

    const origin =
      this.routeOrigin.trim();

    const destination =
      this.routeDestination.trim();

    const distance =
      this.routeDistanceKm.trim();


    if (
      !origin ||
      !destination ||
      !distance
    ) {

      return;

    }


    const route:
      TransportRoute = {

      id:
        `TR-${String(
          this.routes.length + 1
        ).padStart(3, '0')}`,

      origin,

      destination,

      surface:
        this.selectedSurface,

      distanceKm:
        distance

    };


    this.transportService.createRoute(
      route
    );


    this.load();


    this.showRouteForm = false;

  }


  // ==========================================================
  // MOBILIZAÇÃO — ORIGEM
  // ==========================================================

  onMobilizationOriginChange(
    application:
      EquipmentMobilizationApplication
  ): void {

    const destinations =
      this.getDestinations(
        application.origin
      );


    const valid =
      destinations.some(
        destination =>
          this.normalize(
            destination
          ) ===
          this.normalize(
            application.destination
          )
      );


    if (!valid) {

      application.destination = '';

    }

  }


  // ==========================================================
  // COMUM
  // ==========================================================

  private normalize(
    value: string
  ): string {

    return value
      .trim()
      .toUpperCase();

  }


  trackRoute(
    _index: number,
    route: TransportRoute
  ): string {

    return route.id;

  }


  trackApplication(
    _index: number,
    application:
      TransportApplication
  ): string {

    return application.id;

  }


  trackMobilization(
    _index: number,
    application:
      EquipmentMobilizationApplication
  ): string {

    return application.id;

  }


  trackSummary(
    _index: number,
    item:
      EquipmentMobilizationSummary
  ): string {

    return item.id;

  }

}