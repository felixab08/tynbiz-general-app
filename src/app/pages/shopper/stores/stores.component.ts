import {
  Component,
  inject,
  ChangeDetectionStrategy,
  linkedSignal,
  signal,
} from '@angular/core';
import { StoresCardComponent } from '@app/components/stores-card/stores-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '@app/components/search/search.component';
import { LinkParamService, StoresService } from '@app/services';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '@app/components';

@Component({
  selector: 'tyn-stores',
  imports: [
    StoresCardComponent,
    FormsModule,
    CommonModule,
    SearchComponent,
    PaginationComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './stores.component.html',
})
export default class StoresComponent {
  _paginationService = inject(LinkParamService);
  _storesService = inject(StoresService);
  searchValue = signal<string>('');

  inputValue = linkedSignal<string>(() => this.searchValue() ?? '');

  valueSearch(event: string) {
    console.log(event);
    this.searchValue.set(event);
  }
  isFavoriteChange(event: { storeId: number; isFavorite: boolean }) {
    this.storeResorce.reload();
  }
  storeResorce = rxResource({
    params: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
      searchTerm: this.inputValue(),
    }),
    stream: ({ params }) => {
      return (
        this._storesService.getPublicStore({
          page: params.page,
          size: params.size,
          searchTerm: params.searchTerm,
        }) || {}
      );
    },
  });
}
