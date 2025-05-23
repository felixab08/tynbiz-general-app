import { Component } from '@angular/core';
import { InfoCardComponent } from '@app/components/info-card/info-card.component';
import { CardInfo } from '@app/interfaces/card.interface';

@Component({
  selector: 'tyn-home',
  imports: [InfoCardComponent],
  templateUrl: './home.component.html',
})
export default class HomeComponent {
  cardInfo: CardInfo[] = [
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
    {
      id: 2,
      title: 'Interactua con otros usuarios en tus compras',
      titleTow: 'Elige tus productos favoritos',
      descriptionOne:
        'Interactua con otros usuarios en tus compras o puedes contactar directamente a dueña de la tienda desde sala de tynbiz',
      descriptionTwo:
        'Invita a otros usuarios para que te puedan ayudar a decidir en tus compras',
      image: './assets/img/u25.png',
      describeFooter:
        'Elige tus productos favoritos en las tiendas integradas a tynbiz luego busca esos productos desde sala de tynbiz.',
    },
  ];
}
