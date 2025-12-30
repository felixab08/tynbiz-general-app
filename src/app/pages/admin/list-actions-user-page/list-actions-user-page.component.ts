import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { rxResource } from '@angular/core/rxjs-interop';

import { PaginationComponent } from '@app/components/pagination/pagination.component';
import { ActionAuditService, LinkParamService } from '@app/services';
import { FilterComponent } from '@app/components/filter/filter.component';
import { Router } from '@angular/router';
@Component({
  selector: 'tyn-list-actions-user-page',
  imports: [CommonModule, FormsModule, PaginationComponent, FilterComponent],
  templateUrl: './list-actions-user-page.component.html',
})
export default class ListActionsUserPageComponent {
  private _actionAuditService = inject(ActionAuditService);
  _paginationService = inject(LinkParamService);
  _linkService = inject(LinkParamService);
  _router = inject(Router);

  // Filtros
  filterMenu = signal({
    searchShow: true,
    datesShow: true,
    selectShow: false,
  });

  isState = 'All';
  // paginacion
  currentPage = 1;
  itemsPerPage = 10;
  // Filtros por fecha
  search = '';
  startDate: string = '';
  endDate: string = '';

  userActionsResorce = rxResource({
    request: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
      searchTerm: this._linkService.currentSearchTerm(),
      startDate: this._linkService.currentDateInitialFilter(),
      endDate: this._linkService.currentDateEndFilter(),
    }),
    loader: ({ request }) => {
      return (
        this._actionAuditService.getActionAudit({
          page: request.page,
          size: request.size,
          searchTerm: request.searchTerm,
          startDate: request.startDate,
          endDate: request.endDate,
        }) || {}
      );
    },
  });
  changeState(state: string): void {
    this._router.navigate([], {
      queryParams: { status: state, page: 1, size: 5 },
      queryParamsHandling: 'merge',
    });
  }
}
