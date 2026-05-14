import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkParamService } from '@app/services';
import { CreateCreation } from '@app/services/stores/create-creation.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tyn-creation-store-table-creation-page',
  imports: [CommonModule],
  templateUrl: './creation-store-table-creation-page.component.html',
})
export class CreationStoreTableCreationPageComponent {
  tipeTable = input<'PUBLICADOS' | 'OFERTAS' | 'EN_VIVO'>('PUBLICADOS');
  Creation: any = true;

  openDropdownIndex: number | null = null;

  _paginationService = inject(LinkParamService);
  _createCreation = inject(CreateCreation);

  usersResorce = rxResource({
    request: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
      tab: this.tipeTable(),
    }),
    loader: ({ request }) => {
      return (
        this._createCreation.getCreationStore({
          page: request.page,
          size: request.size,
          tab: request.tab,
        }) || {}
      );
    },
  });

  toggleDropdown(creation: any) {
    this.Creation = creation;
    this.openDropdownIndex =
      this.openDropdownIndex === creation.id ? null : creation.id;
  }
}
