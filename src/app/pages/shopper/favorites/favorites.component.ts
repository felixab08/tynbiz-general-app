import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { StoresCardComponent } from '@app/components/stores-card/stores-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { LinkParamService, StoresService } from '@app/services';
import { rxResource } from '@angular/core/rxjs-interop';
import { TitleComponent } from '@app/components';

@Component({
  selector: 'tyn-favorites',
  imports: [FormsModule, CommonModule, StoresCardComponent, TitleComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './favorites.component.html',
})
export default class FavoritesComponent {
  _paginationService = inject(LinkParamService);
  _storesService = inject(StoresService);
  _location = inject(Location);

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
