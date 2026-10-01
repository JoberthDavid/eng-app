import {
  Injectable
} from '@angular/core';


import {
  EquipmentMobilizationApplication,
  EquipmentMobilizationSummary,
  EquipmentTransporter,
  TransportApplication,
  TransportRoute,
  TransportSurface
} from '../models/transport.models';


@Injectable({
  providedIn: 'root'
})
export class TransportService {


  // ==========================================================
  // ROTAS
  // ==========================================================

  private readonly routes:
    TransportRoute[] = [

    // --------------------------------------------------------
    // PAVIMENTADO
    // --------------------------------------------------------

    {
      id: 'TR-P-001',

      origin: 'PEDREIRA',

      destination: 'PISTA',

      surface: 'PAVIMENTADO',

      distanceKm: '146,0'
    },

    {
      id: 'TR-P-002',

      origin: 'AREAL',

      destination: 'PISTA',

      surface: 'PAVIMENTADO',

      distanceKm: '117,4'
    },

    {
      id: 'TR-P-003',

      origin: 'CANTEIRO DE OBRAS',

      destination: 'PISTA',

      surface: 'PAVIMENTADO',

      distanceKm: '18,4'
    },


    // --------------------------------------------------------
    // REVESTIMENTO PRIMÁRIO
    // --------------------------------------------------------

    {
      id: 'TR-RP-001',

      origin: 'PEDREIRA',

      destination: 'PISTA',

      surface: 'REVESTIMENTO_PRIMARIO',

      distanceKm: '3,2'
    },

    {
      id: 'TR-RP-002',

      origin: 'AREAL',

      destination: 'PISTA',

      surface: 'REVESTIMENTO_PRIMARIO',

      distanceKm: '4,7'
    },


    // --------------------------------------------------------
    // LEITO NATURAL
    // --------------------------------------------------------

    {
      id: 'TR-LN-001',

      origin: 'PEDREIRA',

      destination: 'PISTA',

      surface: 'LEITO_NATURAL',

      distanceKm: '0,0'
    },

    {
      id: 'TR-LN-002',

      origin: 'CAIXA DE EMPRÉSTIMO',

      destination: 'CANTEIRO DE OBRAS',

      surface: 'LEITO_NATURAL',

      distanceKm: '2,5'
    }

  ];


  // ==========================================================
  // TRANSPORTE DE MATERIAIS
  // ==========================================================

  private readonly applications:
    TransportApplication[] = [

    {
      id: 'TRA-001',

      compositionCode: 'COMP-001',

      transportCode: '5914374',

      transportDescription:
        'Transporte com caminhão basculante de 10 m³ - rodovia pavimentada',

      transportedItemCode: 'M0191',

      transportedItemDescription: 'Brita 1',

      utilization: '0,0000000000',

      serviceQuantity: '1250,0000',

      origin: 'PEDREIRA',

      destination: 'PISTA',

      surface: 'PAVIMENTADO',

      transportedQuantity: '39,8600',

      transportMoment: '—'
    },


    {
      id: 'TRA-002',

      compositionCode: 'COMP-001',

      transportCode: '5914374',

      transportDescription:
        'Transporte com caminhão basculante de 10 m³ - rodovia pavimentada',

      transportedItemCode: 'M0028',

      transportedItemDescription: 'Areia média',

      utilization: '0,0000000000',

      serviceQuantity: '1250,0000',

      origin: 'AREAL',

      destination: 'PISTA',

      surface: 'PAVIMENTADO',

      transportedQuantity: '24,0000',

      transportMoment: '—'
    },


    {
      id: 'TRA-003',

      compositionCode: 'COMP-002',

      transportCode: '5914389',

      transportDescription:
        'Transporte com caminhão basculante de 15 t - rodovia pavimentada',

      transportedItemCode: 'M3507',

      transportedItemDescription: 'Material demolido',

      utilization: '0,0000000000',

      serviceQuantity: '850,0000',

      origin: 'CANTEIRO DE OBRAS',

      destination: 'PISTA',

      surface: 'PAVIMENTADO',

      transportedQuantity: '72,0000',

      transportMoment: '—'
    },


    {
      id: 'TRA-004',

      compositionCode: 'COMP-003',

      transportCode: '5914374',

      transportDescription:
        'Transporte com caminhão basculante de 10 m³',

      transportedItemCode: 'M0192',

      transportedItemDescription: 'Brita 2',

      utilization: '0,0000000000',

      serviceQuantity: '500,0000',

      origin: 'PEDREIRA',

      destination: 'PISTA',

      surface: 'REVESTIMENTO_PRIMARIO',

      transportedQuantity: '18,5000',

      transportMoment: '—'
    }

  ];


  // ==========================================================
  // EQUIPAMENTOS TRANSPORTADORES
  // ==========================================================

  private readonly equipmentTransporters:
    EquipmentTransporter[] = [

    {
      code: 'E9665',

      description:
        'Caminhão carroceria de madeira'
    },


    {
      code: 'E9027',

      description:
        'Caminhão carroceria com capacidade de 5 t'
    },


    {
      code: 'E9066',

      description:
        'Caminhão carroceria com capacidade de 10 t'
    }

  ];


  // ==========================================================
  // MOBILIZAÇÃO
  // ==========================================================

  private readonly mobilizations:
    EquipmentMobilizationApplication[] = [

    {
      id: 'MOB-001',

      compositionCode: 'COMP-001',

      equipmentCode: 'E9091',

      equipmentDescription:
        'Escavadeira hidráulica sobre esteiras',

      transporterEquipmentCode:
        'E9665',

      origin:
        'CANTEIRO DE OBRAS',

      destination:
        'PISTA',

      surface:
        'PAVIMENTADO',

      averageSpeedKmH:
        '40,00',

      distanceKm:
        '18,4',

      hours:
        '0,4600'
    },


    {
      id: 'MOB-002',

      compositionCode: 'COMP-001',

      equipmentCode: 'E9524',

      equipmentDescription:
        'Motoniveladora',

      transporterEquipmentCode:
        'E9027',

      origin:
        'PEDREIRA',

      destination:
        'PISTA',

      surface:
        'PAVIMENTADO',

      averageSpeedKmH:
        '40,00',

      distanceKm:
        '146,0',

      hours:
        '3,6500'
    },


    {
      id: 'MOB-003',

      compositionCode: 'COMP-001',

      equipmentCode: 'E9091',

      equipmentDescription:
        'Escavadeira hidráulica sobre esteiras',

      transporterEquipmentCode:
        'E9665',

      origin:
        'PEDREIRA',

      destination:
        'PISTA',

      surface:
        'REVESTIMENTO_PRIMARIO',

      averageSpeedKmH:
        '25,00',

      distanceKm:
        '3,2',

      hours:
        '0,1280'
    },


    {
      id: 'MOB-004',

      compositionCode: 'COMP-001',

      equipmentCode: 'E9091',

      equipmentDescription:
        'Escavadeira hidráulica sobre esteiras',

      transporterEquipmentCode:
        'E9665',

      origin:
        'PEDREIRA',

      destination:
        'PISTA',

      surface:
        'LEITO_NATURAL',

      averageSpeedKmH:
        '15,00',

      distanceKm:
        '0,0',

      hours:
        '0,0000'
    }

  ];


  // ==========================================================
  // CONSOLIDAÇÃO
  //
  // Resultado previamente calculado pela camada de negócio.
  // ==========================================================

  private readonly mobilizationSummary:
    EquipmentMobilizationSummary[] = [

    {
      id: 'SUM-001',

      compositionCode: 'COMP-001',

      equipmentCode: 'E9091',

      equipmentDescription:
        'Escavadeira hidráulica sobre esteiras',

      transporterEquipmentCode:
        'E9665',

      hoursPaved:
        '0,4600',

      hoursPrimarilyUnpaved:
        '0,1280',

      hoursNatural:
        '0,0000',

      totalHours:
        '0,5880'
    },


    {
      id: 'SUM-002',

      compositionCode: 'COMP-001',

      equipmentCode: 'E9524',

      equipmentDescription:
        'Motoniveladora',

      transporterEquipmentCode:
        'E9027',

      hoursPaved:
        '3,6500',

      hoursPrimarilyUnpaved:
        '0,0000',

      hoursNatural:
        '0,0000',

      totalHours:
        '3,6500'
    }

  ];


  // ==========================================================
  // GETTERS
  // ==========================================================

  getRoutes():
    TransportRoute[] {

    return [
      ...this.routes
    ];

  }


  getApplications():
    TransportApplication[] {

    return [
      ...this.applications
    ];

  }


  getEquipmentTransporters():
    EquipmentTransporter[] {

    return [
      ...this.equipmentTransporters
    ];

  }


  getMobilizations():
    EquipmentMobilizationApplication[] {

    return [
      ...this.mobilizations
    ];

  }


  getMobilizationSummary():
    EquipmentMobilizationSummary[] {

    return [
      ...this.mobilizationSummary
    ];

  }

  // ==========================================================
  // ROTAS
  // ==========================================================

  createRoute(
    route: TransportRoute
  ): void {

    this.routes.push(route);

  }

  // ==========================================================
  // FILTRO DE ROTAS
  // ==========================================================

  getRoutesBySurface(
    surface:
      TransportSurface
  ):
    TransportRoute[] {

    return this.routes.filter(
      route =>
        route.surface === surface
    );

  }


  // ==========================================================
  // FILTRO DE APLICAÇÕES
  // ==========================================================

  getApplicationsBySurface(
    surface:
      TransportSurface
  ):
    TransportApplication[] {

    return this.applications.filter(
      application =>
        application.surface === surface
    );

  }


  // ==========================================================
  // FILTRO DE MOBILIZAÇÃO
  // ==========================================================

  getMobilizationsBySurface(
    surface:
      TransportSurface
  ):
    EquipmentMobilizationApplication[] {

    return this.mobilizations.filter(
      application =>
        application.surface === surface
    );

  }


  // ==========================================================
  // BUSCA DE ROTA
  // ==========================================================

  findRoute(
    origin: string,
    destination: string,
    surface: TransportSurface
  ):
    TransportRoute | null {

    const normalizedOrigin =
      this.normalize(origin);

    const normalizedDestination =
      this.normalize(destination);


    return this.routes.find(
      route =>

        route.surface === surface

        &&

        this.normalize(route.origin) ===
        normalizedOrigin

        &&

        this.normalize(route.destination) ===
        normalizedDestination

    ) ?? null;

  }


  getDistance(
    origin: string,
    destination: string,
    surface: TransportSurface
  ): string {

    return (

      this.findRoute(
        origin,
        destination,
        surface
      )?.distanceKm

      ??

      '—'

    );

  }


  hasRoute(
    origin: string,
    destination: string,
    surface: TransportSurface
  ): boolean {

    return !!this.findRoute(
      origin,
      destination,
      surface
    );

  }


  // ==========================================================
  // NORMALIZAÇÃO
  // ==========================================================

  private normalize(
    value: string
  ): string {

    return value
      .trim()
      .toUpperCase();

  }

}