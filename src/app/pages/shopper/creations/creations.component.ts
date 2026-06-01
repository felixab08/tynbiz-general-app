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
import { ICreationResp } from '@app/interfaces';

@Component({
  selector: 'tyn-creations',
  imports: [CreationCardComponent, FormsModule, CommonModule, SearchComponent],
  templateUrl: './creations.component.html',
})
export default class CreationsComponent {
  _paginationService = inject(LinkParamService);
  _createCreation = inject(CreateCreation);
  ubigeoId = '';
  keyword = '';
  categoryId = '';
  creationResp: ICreationResp | null = null;
  cardCrea: Cardcreations[] = creationMock;
  valueSearch(event: string) {
    this.keyword = event;
    this.listCreation();
  }

  valueGeographic(event: string) {
    this.ubigeoId = event;
    this.listCreation();
  }
  constructor() {
    this.listCreation();
  }

  listCreation() {
    this._createCreation
      .getCreationDiscovery({
        page: 0,
        size: 100,
        ubigeoId: this.ubigeoId,
        keyword: this.keyword,
        storeCategory: this.categoryId,
      })
      .subscribe((res) => {
        this.creationResp = res;
      });
  }
  valueCategory(event: string) {
    this.categoryId = event;
    this.listCreation();
  }

  // offertResorce = rxResource({
  //   request: () => ({
  //     page: this._paginationService.currentPage() - 1,
  //     size: this._paginationService.currentSize(),
  //     ubigeoId: this.ubigeoId,
  //   }),
  //   loader: ({ request }) => {
  //     return (
  //       this._createCreation.getCreationDiscovery(
  //         {
  //           page: request.page,
  //           size: request.size,
  //           ubigeoId: request.ubigeoId,
  //         },
  //         'ALL',
  //       ) || {}
  //     );
  //   },
  // });
}
