export interface FitCalculation {

  proximityUrbanCenters: string;

  weightedVmd: string;

  graphFactor: string;

  urbanCentersInterference: string;

  resultingFit: string;

  weightedFit: string;

  urbanCenters: FitUrbanCenter[];

  stretches: FitStretch[];

}


export interface FitUrbanCenter {

  city: string;

  perimeterExtensionKm: string;

  proportion: string;

  interference: string;

}


export interface FitStretch {

  snv: string;

  start: string;

  end: string;

  lengthKm: string;

  vmd2019: string;

  vmd2024: string;

  stretchProportion: string;

  stretchFit: string;

  weightedFit: string;

}