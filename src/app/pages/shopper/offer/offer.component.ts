import { Component } from '@angular/core';
import { CreationCardComponent } from '@app/components/creation-card/creation-card.component';
import { Cardcreations } from '@app/interfaces/card.interface';
import { creationMock } from '@app/mock/creations.mock';
@Component({
  selector: 'tyn-offer',
  imports: [CreationCardComponent],
  templateUrl: './offer.component.html',
})
export default class OfferComponent {
  cardOffer: Cardcreations[] = creationMock;
  constructor() {
    this.cardOffer = creationMock.filter(item => item.offer === true);
  }
}
