import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { rolsCreateMock } from '@app/mock/rol.mock';
import { FormNewRolePageComponent } from './form-new-role-page/form-new-role-page.component';

@Component({
  selector: 'tyn-list-role-page',
  imports: [CommonModule, FormsModule, FormNewRolePageComponent],
  templateUrl: './list-role-page.component.html',
})
export default class ListRolePageComponent {
  rolLists = [...rolsCreateMock];

  isState = 'All';
  // paginacion
  currentPage = 1;
  itemsPerPage = 5;
  // Filtros por fecha
  search = '';
  startDate: string = '';
  endDate: string = '';
  isModalOpen = signal(false);

  filterByStatus(status: string): void {
    const isAll = status === 'All';
    const filteList = isAll
      ? rolsCreateMock
      : rolsCreateMock.filter((store) => store.status === status);
    this.rolLists = [...filteList];
  }
  get filteredData() {
    return this.rolLists.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(this.search.toLowerCase());

      const itemDate = new Date(item.dateCreate);
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
