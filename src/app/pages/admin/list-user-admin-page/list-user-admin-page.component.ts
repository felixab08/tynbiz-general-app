import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { userActionsMock } from '@app/mock/rol.mock';
import { CreateUserFormComponent } from '../../../components/create-user-form/create-user-form.component';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { UsersService } from '@app/services/admin/users.service';
import { NotImagePipe } from '@app/pipes/not-image.pipe';
import { PaginationService } from '@app/components/pagination/pagination.service';
import { PaginationComponent } from '@app/components/pagination/pagination.component';

@Component({
  selector: 'tyn-list-user-admin-page',
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    CreateUserFormComponent,
    NotImagePipe,
    PaginationComponent,
  ],
  templateUrl: './list-user-admin-page.component.html',
})
export default class ListUserAdminPageComponent {
  private _usersService = inject(UsersService);
  _paginationService = inject(PaginationService);

  userActions = [...userActionsMock];
  isState = 'All';
  // paginacion
  // Filtros por fecha
  search = '';
  startDate: string = '';
  endDate: string = '';
  numberPageSize = signal(5);
  openDropdownIndex: number | null = null;
  isModalOpen = signal(false);

  router = inject(Router);

  usersResorce = rxResource({
    request: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
    }),
    loader: ({ request }) => {
      return (
        this._usersService.getUsers({
          page: request.page,
          size: request.size,
        }) || {}
      );
    },
  });

  cantPageChange(data: number) {
    console.log('data<<<<<<<<<<', data);

    this.numberPageSize.set(Number(data));
  }

  editUser(id: number): void {
    this.router.navigate(['/admin/user', id]);
  }

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

  toggleDropdown(plan: any) {
    this.openDropdownIndex =
      this.openDropdownIndex === plan.id ? null : plan.id;
  }
  openModal(data?: any) {
    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
  }
}
