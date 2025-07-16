import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { rxResource } from '@angular/core/rxjs-interop';

import { rolsCreateMock } from '@app/mock/rol.mock';
import { FormNewRolePageComponent } from './form-new-role-page/form-new-role-page.component';
import { RolesService } from '@app/services/admin/roles.service';

import { PaginationService } from '@app/components/pagination/pagination.service';
import { PaginationComponent } from '@app/components/pagination/pagination.component';
@Component({
  selector: 'tyn-list-role-page',
  imports: [
    CommonModule,
    FormsModule,
    FormNewRolePageComponent,
    PaginationComponent,
  ],
  templateUrl: './list-role-page.component.html',
})
export default class ListRolePageComponent {
  private _rolesService = inject(RolesService);
  _paginationService = inject(PaginationService);

  rolLists = [...rolsCreateMock];

  isState = 'All';

  // Filtros por fecha
  search = '';
  startDate: string = '';
  endDate: string = '';
  isModalOpen = signal(false);

  rolesResorce = rxResource({
    request: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
    }),
    loader: ({ request }) => {
      return (
        this._rolesService.getRoles({
          page: request.page,
          size: request.size,
        }) || {}
      );
    },
  });

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
}
