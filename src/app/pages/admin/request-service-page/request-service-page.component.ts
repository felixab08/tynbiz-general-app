import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationService } from '@app/components/pagination/pagination.service';
import { SuscriptionService } from '@app/services';
import { PaginationComponent } from '@app/components/pagination/pagination.component';
import { Router } from '@angular/router';
import { FilterComponent } from '@app/components/filter/filter.component';
@Component({
  selector: 'tyn-request-service-page',
  imports: [CommonModule, FormsModule, PaginationComponent, FilterComponent],
  templateUrl: './request-service-page.component.html',
})
export default class RequestServicePageComponent {
  isState: string = 'All';
  isModalOpen = signal(false);
  selectedSolicDemo: any = true;
  selectedTab: string = 'verifyInformation';
  // Filtros por fecha

  // Filtros
  filterMenu = signal({
    searchShow: true,
    datesShow: true,
    selectShow: true,
    filterSelectList: [
      {
        id: 'EN_REVISION',
        value: 'En revisión',
      },
      {
        id: 'EN_INCORPORACION',
        value: 'En incorporación',
      },
      {
        id: 'INCORPORADO',
        value: 'Incorporado',
      },
    ],
  });

  isSearchTermFilter = signal('');
  isDateStartFilter = signal('');
  isDateEndFilter = signal('');

  startDate: string = '';
  endDate: string = '';

  private _suscriptionService = inject(SuscriptionService);
  _paginationService = inject(PaginationService);
  _router = inject(Router);

  suscriptionResorce = rxResource({
    request: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
      status: this._paginationService.currentStatus(),
      searchTerm:
        this.isSearchTermFilter() ||
        this._paginationService.currentSearchTerm(),
      startDate: this.isDateStartFilter(),
      endDate: this.isDateEndFilter(),
    }),
    loader: ({ request }) => {
      console.log(request);

      return (
        this._suscriptionService.getSuscriptionRequest({
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
  openModal(SolicDemo: any) {
    this.selectedSolicDemo = SolicDemo;
    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
  }
}
