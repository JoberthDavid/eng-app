import {
  Injectable
} from '@angular/core';


import {
  MaterialOccurrence
} from '../models/occurrence.models';



@Injectable({
  providedIn:'root'
})
export class OccurrenceService {


  private occurrences:
    MaterialOccurrence[] = [


    {
      id:'1',

      name:'Pedreira Ciplan',

      type:'PEDREIRA',

      material:'Brita 1',

      supplier:'CIPLAN',

      latitude:-16.6201,

      longitude:-49.2504,

      kilometer:'KM 35',

      distanceToProject:'32,40 km',

      transportCode:'5914359',

      source:'MANUAL',

      active:true

    },


    {
      id:'2',

      name:'Areal Lemos',

      type:'AREAL',

      material:'Areia média',

      supplier:'AREAL LEMOS',

      latitude:-16.6802,

      longitude:-49.1601,

      kilometer:'KM 58',

      distanceToProject:'21,70 km',

      transportCode:'5914374',

      source:'MANUAL',

      active:true

    },


    {
      id:'3',

      name:'Usina Asfáltica GO',

      type:'USINA',

      material:'CAP 50/70',

      supplier:'USINA XYZ',

      latitude:-16.7400,

      longitude:-49.2000,

      kilometer:'KM 80',

      distanceToProject:'45,20 km',

      transportCode:'5914389',

      source:'MANUAL',

      active:true

    }

  ];



  getAll():

  MaterialOccurrence[] {

    return this.occurrences;

  }


}