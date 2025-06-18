import { Component, signal } from '@angular/core';
import { resquestDemoListMock } from '@app/mock/resquet-demo-list.mock';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'tyn-request-service-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './request-service-page.component.html',
})
export default class RequestServicePageComponent {
  resquestList = resquestDemoListMock;
  isState = 'All';
  isModalOpen = signal(false);
  selectedSolicDemo: any = true;
  search = '';
  currentPage = 1;
  itemsPerPage = 10;
  // Filtros por fecha
  startDate: string = '';
  endDate: string = '';
  selectedTab: string = 'verifyInformation';

  filterByStatus(status: string): void {
    const isAll = status === 'All';
    const filteList = isAll
      ? resquestDemoListMock
      : resquestDemoListMock.filter(
          (store) => store.storeStatusService === status
        );
    this.resquestList = [...filteList];
  }
  changeState(state: string): void {
    this.isState = state;
    this.filterByStatus(state);
  }
  openModal(SolicDemo: any) {
    this.selectedSolicDemo = SolicDemo;
    this.isModalOpen.set(true);
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
    return this.filteredData.slice(start, start + this.itemsPerPage);
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
}
