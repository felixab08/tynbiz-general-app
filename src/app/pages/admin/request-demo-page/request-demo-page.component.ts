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
  currentPage = 1;
  itemsPerPage = 10;
  search = '';
  startDate: string = '';
  endDate: string = '';
  selectedTab: string = 'verifyInformation';

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

  filterByStatus(status: string): void {
    const isAll = status === 'All';
    const filteredList = isAll
      ? resquestDemoListMock
      : resquestDemoListMock.filter((store) => store.storeStatus === status);
    this.resquestList = [...filteredList];
    this.currentPage = 1;
  }

  openModal(SolicDemo: RequestDemoContent) {
    this.searchDemoById(SolicDemo.id);
    this.isModalOpen.set(true);
  }

  searchDemoById(id: number) {
    this._requesDemoService.getRequestDemoById(id).subscribe({
      next: (resp: any) => {
        console.log('resp------>');
        console.log(resp);
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

  get filteredData() {
    return this.resquestList.filter((item) => {
      const matchesSearch = item.storeName
        .toLowerCase()
        .includes(this.search.toLowerCase());

      const itemDate = new Date(item.requestDate);
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;
      const matchesDate =
        (!start || itemDate >= start) && (!end || itemDate <= end);
      return matchesSearch && matchesDate;
    });
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredData.slice(start, this.currentPage * this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  totalPages() {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }

  setPage(page: number) {
    this.currentPage = page;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }

  onItemsPerPageChange(value: number) {
    this.itemsPerPage = value;
    this.currentPage = 1;
  }
}
