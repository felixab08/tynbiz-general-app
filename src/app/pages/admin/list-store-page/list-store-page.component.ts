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
import { FILTERSELECTLIST, ISREPORTSTORE } from '@app/constant';
type storeStatus =
  | 'suspend'
  | 'activate'
  | 'cancel'
  | 'complete-onboarding'
  | 'view';

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
      id: 'Ver tienda',
      value: 'view',
      status: 'All',
    },
    {
      id: 'Suspender',
      value: 'suspend',
      status: 'Suspendido',
    },
    {
      id: 'Cancelar',
      value: 'cancel',
      status: 'Cancelado',
    },
    {
      id: 'Activar',
      value: 'activate',
      status: 'Activo',
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
      this._storeManagementSrv.putStoreState(id, type).subscribe((response) => {
        console.log('Store state updated:', response);
      });
      this.openDropdownIndex = null;
    }
  }
}
