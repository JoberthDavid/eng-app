export type OccurrenceType =
  | 'PEDREIRA'
  | 'AREAL'
  | 'JAZIDA'
  | 'USINA'
  | 'CANTEIRO';


export interface MaterialOccurrence {

  id: string;

  name: string;

  type: OccurrenceType;


  material: string;

  supplier: string;


  latitude: number;

  longitude: number;


  kilometer?: string;


  distanceToProject?: string;


  transportCode?: string;


  source:

    | 'MANUAL'
    | 'DNIT'
    | 'SIGMINE'
    | 'API';


  active: boolean;

}