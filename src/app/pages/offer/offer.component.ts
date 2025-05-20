import { Component } from '@angular/core';
import { OfferCardComponent } from '../../components/offer-card/offer-card.component';
import { CardOffer } from '@app/interfaces/card.interface';
@Component({
  selector: 'tyn-offer',
  imports: [OfferCardComponent],
  templateUrl: './offer.component.html',
})
export default class OfferComponent {
    cardOffer: CardOffer[] = [
      {
      id: 1,
      title: 'Full polos ofertas',
      estado: 'se activa en vivo',
      day:'3 dias',
      time: '10:06:03',
      image: './assets/img/u9.png',
      nameTienda: 'Falabella',
      logoTienda: './assets/img/u5.png',
      sitioTienda: 'www.falabella.com',
      numVistas: '647',
    },
    {
      id: 2,
      title: 'Full polos ofertas',
      estado: 'activo',
      day:'3 dias',
      time: '10:06:03',
      image: './assets/img/u9.png',
      nameTienda: 'Tiendas virtuales asociados',
      logoTienda: './assets/img/u5.png',
      sitioTienda: 'www.falabella.com',
      numVistas: '100',
    },
    {
      id: 3,
      title: 'Full polos ofertas',
      estado: 'se activa en vivo',
      day:'3 dias',
      time: '10:06:03',
      image: './assets/img/u9.png',
      nameTienda: 'Falabella',
      logoTienda: './assets/img/u5.png',
      sitioTienda: 'www.falabella.com',
      numVistas: '647',
    },
    {
      id: 4,
      title: 'Full polos ofertas',
      estado: 'activo',
      day:'3 dias',
      time: '10:06:03',
      image: './assets/img/u9.png',
      nameTienda: 'Tiendas virtuales asociados',
      logoTienda: './assets/img/u5.png',
      sitioTienda: 'www.falabella.com',
      numVistas: '100',
    },
    ]
}
