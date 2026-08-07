import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkParamService } from '@app/services';
import { CreateCreation } from '@app/services/stores/create-creation.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tyn-creation-store-table-creation-page',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './creation-store-table-creation-page.component.html',
})
export class CreationStoreTableCreationPageComponent {
  tipeTable = input<'PUBLICADOS' | 'OFERTAS' | 'EN_VIVO'>('PUBLICADOS');
  Creation: any = true;

  openDropdownIndex: number | null = null;

  _paginationService = inject(LinkParamService);
  _createCreation = inject(CreateCreation);

  usersResorce = rxResource({
    params: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
      tab: this.tipeTable(),
    }),
    stream: ({ params }) => {
      return (
        this._createCreation.getCreationStore({
          page: params.page,
          size: params.size,
          tab: params.tab,
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
