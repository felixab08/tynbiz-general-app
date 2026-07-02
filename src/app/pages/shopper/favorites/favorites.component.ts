import { Component, inject } from '@angular/core';
import { StoresCardComponent } from '@app/components/stores-card/stores-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { storeMock } from '@app/mock/store.mock';
import { CardStores } from '@app/interfaces/card.interface';
import { LinkParamService, StoresService } from '@app/services';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tyn-favorites',
  imports: [FormsModule, CommonModule, StoresCardComponent],
  templateUrl: './favorites.component.html',
})
export default class FavoritesComponent {
  _paginationService = inject(LinkParamService);
  _storesService = inject(StoresService);

  valueSearch(event: string) {
    console.log(event);
  }

  storefavoritesResorce = rxResource({
    request: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
    }),
    loader: ({ request }) => {
      return (
        this._storesService.getFavoriteStore({
          page: request.page,
          size: request.size,
        }) || {}
      );
    },
  });
}
