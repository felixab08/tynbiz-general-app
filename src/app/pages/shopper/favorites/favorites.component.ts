import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './favorites.component.html',
})
export default class FavoritesComponent {
  _paginationService = inject(LinkParamService);
  _storesService = inject(StoresService);

  storefavoritesResorce = rxResource({
    params: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
    }),
    stream: ({ params }) => {
      return (
        this._storesService.getFavoriteStore({
          page: params.page,
          size: params.size,
        }) || {}
      );
    },
  });
}
