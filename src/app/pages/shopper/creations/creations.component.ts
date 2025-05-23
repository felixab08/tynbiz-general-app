import { Component } from '@angular/core';
import { CardOffer } from '@app/interfaces/card.interface';
import { offerMock } from '@app/mock/offer.mock';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OfferCardComponent } from '@app/components/offer-card/offer-card.component';
import { SearchComponent } from '@app/components/search/search.component';
@Component({
  selector: 'tyn-creations',
  imports: [OfferCardComponent, FormsModule, CommonModule, SearchComponent],
  templateUrl: './creations.component.html',
})
export default class CreationsComponent {
  cardCrea: CardOffer[] = offerMock;
  valueSearch(event: string[]) {
    console.log(event);
  }
}
