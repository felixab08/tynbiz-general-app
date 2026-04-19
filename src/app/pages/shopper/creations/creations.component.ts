import { Component, inject } from '@angular/core';
import { Cardcreations } from '@app/interfaces/card.interface';
import { creationMock } from '@app/mock/creations.mock';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreationCardComponent } from '@app/components/creation-card/creation-card.component';
import { SearchComponent } from '@app/components/search/search.component';

import { rxResource } from '@angular/core/rxjs-interop';
import { LinkParamService } from '@app/services';
import { CreateCreation } from '@app/services/stores/create-creation.service';

@Component({
  selector: 'tyn-creations',
  imports: [CreationCardComponent, FormsModule, CommonModule, SearchComponent],
  templateUrl: './creations.component.html',
})
export default class CreationsComponent {
  _paginationService = inject(LinkParamService);
  _createCreation = inject(CreateCreation);

  cardCrea: Cardcreations[] = creationMock;
  valueSearch(event: string[]) {
    console.log(event);
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
          'ALL',
        ) || {}
      );
    },
  });
}
