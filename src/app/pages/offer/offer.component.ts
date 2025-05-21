import { Component } from '@angular/core';
import { OfferCardComponent } from '../../components/offer-card/offer-card.component';
import { CardOffer } from '@app/interfaces/card.interface';
import { offerMock } from '@app/mock/offer.mock';
@Component({
  selector: 'tyn-offer',
  imports: [OfferCardComponent],
  templateUrl: './offer.component.html',
})
export default class OfferComponent {
    cardOffer: CardOffer[] = offerMock
}
