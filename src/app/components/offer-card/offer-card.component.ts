import { Component, input } from '@angular/core';
import { CardOffer } from '@app/interfaces/card.interface';
@Component({
  selector: 'tyn-offer-card',
  imports: [],
  templateUrl: './offer-card.component.html',
})
export class OfferCardComponent {
  listOffer = input.required<CardOffer[]>();
}
