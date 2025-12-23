import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { resquestDemoListMock } from '@app/mock/resquet-demo-list.mock';
import { SimpleCardComponent } from '../../../components/simple-card/simple-card.component';
import { LinkParamService, StoreManagementService } from '@app/services';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { PaginationComponent } from '@app/components/pagination/pagination.component';
import { FilterComponent } from '@app/components/filter/filter.component';

@Component({
  selector: 'tyn-list-store-page',
  imports: [
    CommonModule,
    FormsModule,
    SimpleCardComponent,
    PaginationComponent,
    FilterComponent,
  ],
  templateUrl: './list-store-page.component.html',
})
export default class ListStorePageComponent {
  rolLists = [...resquestDemoListMock];
  private _storeManagementSrv = inject(StoreManagementService);
  _linkService = inject(LinkParamService);
  _router = inject(Router);

  isState = 'All';
  // Filtros por fecha
  isReportStore = [
    {
      id: 1111,
      title: 'Total tiendas',
      describe: 'Tiendas virtuales asociados a plataforma tynbiz',
      cant: 10000,
    },
    {
      id: 1112,
      title: 'Tiendas activas',
      describe:
        'Tiendas virtuales activas que estan con un plan en la plataforma tynbiz',
      cant: 8000,
    },
    {
      id: 1113,
      title: 'Tiendas Suspendidos',
      describe:
        'Tiendas virtuales suspendidos por falta de pago de un plan en la plat. tynbiz',
      cant: 1500,
    },
  ];
  // Filtros
  filterMenu = signal({
    searchShow: true,
    datesShow: true,
    selectShow: true,
    filterSelectList: [
      {
        id: 'PENDING',
        value: 'Pendiente',
      },
      {
        id: 'ACTIVE',
        value: 'Activo',
      },
      {
        id: 'SUSPENDED',
        value: 'Suspendido',
      },
      {
        id: 'CANCELLED',
        value: 'Cancelado',
      },
    ],
  });

  storeResorce = rxResource({
    request: () => ({
      page: this._linkService.currentPage() - 1,
      size: this._linkService.currentSize(),
      status: this._linkService.currentStatus(),
      searchTerm: this._linkService.currentSearchTerm(),
      startDate: this._linkService.currentDateInitialFilter(),
      endDate: this._linkService.currentDateEndFilter(),
    }),
    loader: ({ request }) => {
      return (
        this._storeManagementSrv.getAllStoresSeach({
          page: request.page,
          size: request.size,
          searchTerm: request.searchTerm,
          status: request.status,
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
