export type TransportSurface =
  | 'PAVIMENTADO'
  | 'REVESTIMENTO_PRIMARIO'
  | 'LEITO_NATURAL';


export interface TransportRoute {

  id: string;

  origin: string;

  destination: string;

  surface: TransportSurface;

  distanceKm: string;

}


export interface TransportApplication {

  id: string;


  // ==========================================================
  // COMPOSIÇÃO
  // ==========================================================

  compositionCode: string;


  // ==========================================================
  // TRANSPORTE SICRO
  // ==========================================================

  transportCode: string;

  transportDescription: string;


  // ==========================================================
  // ITEM TRANSPORTADO
  // ==========================================================

  transportedItemCode: string;

  transportedItemDescription: string;


  // ==========================================================
  // DADOS DA COMPOSIÇÃO
  // ==========================================================

  utilization: string;

  serviceQuantity: string;


  // ==========================================================
  // ROTA
  // ==========================================================

  origin: string;

  destination: string;

  surface: TransportSurface;


  // ==========================================================
  // QUANTIDADE
  // ==========================================================

  transportedQuantity: string;


  // ==========================================================
  // RESULTADO
  // ==========================================================

  transportMoment: string;

}


export interface EquipmentTransporter {

  code: string;

  description: string;

}


export interface EquipmentMobilizationApplication {

  id: string;


  // ==========================================================
  // COMPOSIÇÃO
  // ==========================================================

  compositionCode: string;


  // ==========================================================
  // EQUIPAMENTO A SER MOBILIZADO
  // ==========================================================

  equipmentCode: string;

  equipmentDescription: string;


  // ==========================================================
  // EQUIPAMENTO TRANSPORTADOR
  // ==========================================================

  transporterEquipmentCode: string;


  // ==========================================================
  // ROTA
  // ==========================================================

  origin: string;

  destination: string;

  surface: TransportSurface;


  // ==========================================================
  // PARÂMETROS / RESULTADOS
  // ==========================================================

  averageSpeedKmH: string;

  distanceKm: string;

  hours: string;

}


export interface EquipmentMobilizationSummary {

  id: string;

  compositionCode: string;

  equipmentCode: string;

  equipmentDescription: string;

  transporterEquipmentCode: string;

  hoursPaved: string;

  hoursPrimarilyUnpaved: string;

  hoursNatural: string;

  totalHours: string;

}