import {

  AfterViewInit,

  Component,

  inject

} from '@angular/core';


import {
  CommonModule
} from '@angular/common';


import * as L from 'leaflet';


import {

 MaterialOccurrence,

 OccurrenceType

}

from '../../../models/occurrence.models';


import {
 OccurrenceService
}

from '../../../services/occurrence.service';



@Component({

 selector:'app-occurrences-map',

 standalone:true,


 imports:[
  CommonModule
 ],


 templateUrl:

 './occurrences-map-page.component.html',


 styleUrl:

 './occurrences-map-page.component.scss'

})

export class OccurrencesMapComponent

implements AfterViewInit {


private readonly service =
 inject(OccurrenceService);



occurrences:
MaterialOccurrence[] = [];



filtered:
MaterialOccurrence[] = [];



selectedType:
OccurrenceType | 'TODOS'
=
'TODOS';



private map!: L.Map;



ngOnInit(){


this.occurrences =
 this.service.getAll();


this.filtered =
 this.occurrences;


}



ngAfterViewInit(){


this.createMap();


this.renderMarkers();


}




createMap(){


this.map =
L.map('map')

.setView(

[-16.60,-49.25],

10

);



L.tileLayer(

'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

).addTo(this.map);



}



renderMarkers(){


this.filtered.forEach(

occ => {


const marker =

L.marker(

[
occ.latitude,
occ.longitude
],

{

icon:
this.getIcon(
occ.type
)

}

);



marker.bindPopup(`

<strong>
${occ.name}
</strong>

<br>

Material:
${occ.material}

<br>

Fornecedor:
${occ.supplier}

<br>

Distância:
${occ.distanceToProject ?? '-'}

<br>

Código:
${occ.transportCode ?? '-'}

`);



marker.addTo(this.map);


}

);

}



filter(type:
OccurrenceType | 'TODOS'){


this.selectedType = type;


this.filtered =

type==='TODOS'

?

this.occurrences

:

this.occurrences.filter(

x=>x.type===type

);



this.map.eachLayer(

layer=>{


if(layer instanceof L.Marker)

this.map.removeLayer(layer);


}

);



this.renderMarkers();



}



getIcon(
type:OccurrenceType
){


const colors:any={


PEDREIRA:'#2563eb',

AREAL:'#eab308',

JAZIDA:'#f97316',

USINA:'#dc2626',

CANTEIRO:'#9333ea'


};


return L.divIcon({

html:

`

<div style="
background:${colors[type]};
width:28px;
height:28px;
border-radius:50%;
border:3px solid white;
box-shadow:0 2px 8px #555;
">
</div>

`,


className:'',

iconSize:[28,28]


});


}



}