import { Component, inject } from '@angular/core';
import { CreationCardComponent } from '@app/components/creation-card/creation-card.component';
import { Cardcreations } from '@app/interfaces/card.interface';
import { creationMock } from '@app/mock/creations.mock';
import { LinkParamService } from '@app/services';
import { CreateCreation } from '@app/services/stores/create-creation.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tyn-offer',
  imports: [CreationCardComponent],
  templateUrl: './offer.component.html',
})
export default class OfferComponent {
  _createCreation = inject(CreateCreation);
  _paginationService = inject(LinkParamService);
  _linkService = inject(LinkParamService);
  cardOffer: Cardcreations[] = creationMock;
  constructor() {
    this.cardOffer = creationMock.filter((item) => item.offer === true);
  }
  offertResorce = rxResource({
    request: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
    }),
    loader: ({ request }) => {
      return (
        this._createCreation.getCreationDiscovery(
          {
            page: request.page,
            size: request.size,
          },
          'OFERTAS',
        ) || {}
      );
    },
  });
}
