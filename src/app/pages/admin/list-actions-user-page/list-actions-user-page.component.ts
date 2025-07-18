import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { rxResource } from '@angular/core/rxjs-interop';

import { PaginationService } from '@app/components/pagination/pagination.service';
import { ActionsUserService } from '@app/services/admin/actions-user.service';

import { userActionsMock } from '@app/mock/rol.mock';
import { PaginationComponent } from '@app/components/pagination/pagination.component';
@Component({
  selector: 'tyn-list-actions-user-page',
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './list-actions-user-page.component.html',
})
export default class ListActionsUserPageComponent {
  private _userActionsService = inject(ActionsUserService);
  _paginationService = inject(PaginationService);

  userActions = [...userActionsMock];
  isState = 'All';
  // paginacion
  currentPage = 1;
  itemsPerPage = 10;
  // Filtros por fecha
  search = '';
  startDate: string = '';
  endDate: string = '';

  userActionsResorce = rxResource({
    request: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
    }),
    loader: ({ request }) => {
      return (
        this._userActionsService.getUsersActions({
          page: request.page,
          size: request.size,
        }) || {}
      );
    },
  });

  filterByStatus(status: string): void {
    const isAll = status === 'All';
    const filteList = isAll
      ? userActionsMock
      : userActionsMock.filter((store) => store.status === status);
    this.userActions = [...filteList];
  }
  get filteredData() {
    return this.userActions.filter((item) => {
      const matchesSearch = item.nameUser
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
