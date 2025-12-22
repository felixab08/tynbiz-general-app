import { Component, inject, signal } from '@angular/core';
import { resquestDemoListMock } from '../../../mock/resquet-demo-list.mock';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { LinkParamService, RequesDemoService } from '@app/services';
import { RequestDemoContent } from '@app/interfaces';
import { FilterComponent } from '@app/components/filter/filter.component';
import { Router } from '@angular/router';
import { PaginationComponent } from '@app/components/pagination/pagination.component';
@Component({
  selector: 'tyn-request-demo-page',
  imports: [FormsModule, CommonModule, FilterComponent, PaginationComponent],
  templateUrl: './request-demo-page.component.html',
})
export default class RequestDemoPageComponent {
  private _requesDemoService = inject(RequesDemoService);
  _linkService = inject(LinkParamService);
  _router = inject(Router);

  resquestList = resquestDemoListMock;
  isState = 'All';
  isModalOpen = signal(false);
  selectedSolicDemo: RequestDemoContent | null = null;

  // Filtros
  filterMenu = signal({
    searchShow: true,
    datesShow: true,
    selectShow: true,
    filterSelectList: [
      {
        id: 'PENDIENTE',
        value: 'Pendiente',
      },
      {
        id: 'ATENDIDO',
        value: 'Atendido',
      },
    ],
  });

  demoResorce = rxResource({
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
        this._requesDemoService.getRequestDemo({
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

  openModal(SolicDemo: RequestDemoContent) {
    this.searchDemoById(SolicDemo.id);
    this.isModalOpen.set(true);
  }

  searchDemoById(id: number) {
    this._requesDemoService.getRequestDemoById(id).subscribe({
      next: (resp: any) => {
        this.selectedSolicDemo = resp;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
