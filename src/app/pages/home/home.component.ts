import { Component } from '@angular/core';
import { StoreCardComponent } from '../../components/store-card/store-card.component';
import { CardStore } from '@app/interfaces/card.interface';

@Component({
  selector: 'tyn-home',
  imports: [StoreCardComponent],
  templateUrl: './home.component.html',
})
export default class HomeComponent {
  cardStore: CardStore[] = [
    {
      id: 1,
      title: 'Tiendas asociadas a tynbiz',
      titleTow: 'Cantidad +300',
      descriptionOne:
        'Encuentra en tynbiz todas las tiendas virtuales de diferentes categorias',
      descriptionTwo:
        '      Los usuarios que acceden a cualquier tienda virtual asociado a tynbiz, puden utilizar sala de tynbiz para una compra interactiva con otros usuarios o con el vendedor',
      image: './assets/img/u55.png',
      describeFooter: 'Tiendas virtuales asociados',
    },
  ];
}
