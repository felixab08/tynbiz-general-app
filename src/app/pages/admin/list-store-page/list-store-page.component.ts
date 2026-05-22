import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SimpleCardComponent } from '../../../components/simple-card/simple-card.component';
import {
  AlertService,
  LinkParamService,
  StoreManagementService,
} from '@app/services';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { PaginationComponent } from '@app/components/pagination/pagination.component';
import { FilterComponent } from '@app/components/filter/filter.component';
import { FILTERSELECTLIST, ISREPORTSTORE } from '@app/constant';
import { IErrorGeneralResp } from '@app/interfaces';
type storeStatus = 'SUSPENDED' | 'ACTIVE' | 'CANCELLED' | 'PENDING' | 'view';

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
  private _storeManagementSrv = inject(StoreManagementService);
  _linkService = inject(LinkParamService);
  private _alertService = inject(AlertService);

  _router = inject(Router);
  selectedPlanList: any = true;
  openDropdownIndex: number | null = null;
  isState = 'All';
  // Filtros por fecha
  isReportStore = ISREPORTSTORE;
  // Filtros
  filterMenu = signal({
    searchShow: true,
    datesShow: true,
    selectShow: true,
    filterSelectList: FILTERSELECTLIST,
  });

  listStatus = [
    {
      id: 'Suspender',
      value: 'SUSPENDED',
      status: 'SUSPENDED',
    },
    {
      id: 'Cancelar',
      value: 'CANCELLED',
      status: 'CANCELLED',
    },
    {
      id: 'Activar',
      value: 'ACTIVE',
      status: 'ACTIVE',
    },
  ] as any;

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
  toggleDropdown(plan: any) {
    this.selectedPlanList = plan;
    this.openDropdownIndex =
      this.openDropdownIndex === plan.id ? null : plan.id;
  }
  currentStateOption(id: number, type: storeStatus): void {
    if (type !== 'view') {
      this._storeManagementSrv.putStoreState(id, type).subscribe({
        next: (resp) => {
          this._alertService.getAlert(
            'Bien!!!',
            'Estado de la tienda actualizado correctamente.',
            'success',
          );
        },
        error: (err: IErrorGeneralResp) => {
          this._alertService.getAlert(
            'Error!!!',
            err.error.detail || 'Error al actualizar el estado de la tienda',
            'error',
          );
        },
      });
      this.openDropdownIndex = null;
    }
  }
}
