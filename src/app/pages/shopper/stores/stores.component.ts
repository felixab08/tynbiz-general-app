import { Component, inject } from '@angular/core';
import { StoresCardComponent } from '@app/components/stores-card/stores-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { storeMock } from '@app/mock/store.mock';
import { SearchComponent } from '@app/components/search/search.component';
import { CardStores } from '@app/interfaces/card.interface';
import { LinkParamService, StoresService } from '@app/services';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tyn-stores',
  imports: [StoresCardComponent, FormsModule, CommonModule, SearchComponent],
  templateUrl: './stores.component.html',
})
export default class StoresComponent {
  cardStores: CardStores[] = storeMock;
  _paginationService = inject(LinkParamService);
  _storesService = inject(StoresService);

  valueSearch(event: string) {
    console.log(event);
  }

  storeResorce = rxResource({
    request: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
    }),
    loader: ({ request }) => {
      return (
        this._storesService.getPublicStore({
          page: request.page,
          size: request.size,
        }) || {}
      );
    },
  });
}
