import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { resquestDemoListMock } from '@app/mock/resquet-demo-list.mock';
import { SimpleCardComponent } from '../../../components/simple-card/simple-card.component';

@Component({
  selector: 'tyn-list-store-page',
  imports: [CommonModule, FormsModule, SimpleCardComponent],
  templateUrl: './list-store-page.component.html',
})
export default class ListStorePageComponent {
  rolLists = [...resquestDemoListMock];
  isState = 'All';
  // paginacion
  currentPage = 1;
  itemsPerPage = 10;
  // Filtros por fecha
  search = '';
  startDate: string = '';
  endDate: string = '';
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
  filterByStatus(status: string): void {
    const isAll = status === 'All';
    const filteList = isAll
      ? resquestDemoListMock
      : resquestDemoListMock.filter((store) => store.status === status);
    this.rolLists = [...filteList];
  }
  get filteredData() {
    return this.rolLists.filter((item) => {
      const matchesSearch = item.storeName
        .toLowerCase()
        .includes(this.search.toLowerCase());

      const itemDate = new Date(item.planDate);
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
