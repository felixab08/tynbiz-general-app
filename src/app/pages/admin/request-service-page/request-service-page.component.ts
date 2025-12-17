import { Component, inject, linkedSignal, signal } from '@angular/core';
import { resquestDemoListMock } from '@app/mock/resquet-demo-list.mock';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationService } from '@app/components/pagination/pagination.service';
import { SuscriptionService } from '@app/services';
import { PaginationComponent } from '@app/components/pagination/pagination.component';
import { Router } from '@angular/router';
@Component({
  selector: 'tyn-request-service-page',
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './request-service-page.component.html',
})
export default class RequestServicePageComponent {
  resquestList = resquestDemoListMock;
  isState: string = 'All';
  isModalOpen = signal(false);
  selectedSolicDemo: any = true;
  selectedTab: string = 'verifyInformation';
  currentPage = 1;
  itemsPerPage = 5;

  private _suscriptionService = inject(SuscriptionService);
  _paginationService = inject(PaginationService);
  _router = inject(Router);

  suscriptionResorce = rxResource({
    request: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
      status: this._paginationService.currentStatus(),
    }),
    loader: ({ request }) => {
      console.log(request);

      return (
        this._suscriptionService.getSuscriptionRequest({
          page: request.page,
          size: request.size,
          status: request.status,
        }) || {}
      );
    },
  });

  filterByStatus(status: string): void {
    const isAll = status === 'All';
    const filteList = isAll
      ? resquestDemoListMock
      : resquestDemoListMock.filter(
          (store) => store.storeStatusService === status
        );
    this.resquestList = [...filteList];
    this.currentPage = 1;
  }
  changeState(state: string): void {
    this.isState = state;
    console.log(this.isState);
    this._router.navigate([], {
      queryParams: { status: this.isState },
      queryParamsHandling: 'merge',
    });

    // this.filterByStatus(state);
  }
  openModal(SolicDemo: any) {
    this.selectedSolicDemo = SolicDemo;
    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
  }
  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.resquestList.slice(start, this.currentPage * this.itemsPerPage);
  }
  totalPages() {
    return Math.ceil(this.resquestList.length / this.itemsPerPage);
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
