import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { userActionsMock } from '@app/mock/rol.mock';
import { CreateUserFormComponent } from '../../../components/create-user-form/create-user-form.component';
import { rxResource } from '@angular/core/rxjs-interop';

import { UsersService } from '@app/services/admin/users.service';

import { NotImagePipe } from '@app/pipes/not-image.pipe';

import { PaginationService } from '@app/components/pagination/pagination.service';
import { PaginationComponent } from '@app/components/pagination/pagination.component';
import { FilterComponent } from '@app/components/filter/filter.component';

@Component({
  selector: 'tyn-list-user-admin-page',
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    CreateUserFormComponent,
    NotImagePipe,
    PaginationComponent,
    FilterComponent,
  ],
  templateUrl: './list-user-admin-page.component.html',
})
export default class ListUserAdminPageComponent {
  private _usersService = inject(UsersService);
  _paginationService = inject(PaginationService);

  userActions = [...userActionsMock];
  isState = 'All';
  // paginacion
  // Filtros
  filterMenu = signal({
    searchShow: true,
    datesShow: true,
    selectShow: true,
    filterSelectList: [
      {
        id: '1',
        value: 'Activo',
      },
      {
        id: '0',
        value: 'Inactivo',
      },
    ],
  });

  openDropdownIndex: number | null = null;
  isModalOpen = signal(false);

  router = inject(Router);

  isNameFilter = signal('');
  isSelectedFilter = signal('');
  isDateStartFilter = signal('');
  isDateEndFilter = signal('');

  usersResorce = rxResource({
    request: () => ({
      page: this._paginationService.currentPage() - 1,
      size: this._paginationService.currentSize(),
      nombre: this.isNameFilter(),
      estado: this.isSelectedFilter(),
      fechaInicio: this.isDateStartFilter(),
      fechaFin: this.isDateEndFilter(),
    }),
    loader: ({ request }) => {
      return (
        this._usersService.getUsers({
          page: request.page,
          size: request.size,
          nombre: request.nombre,
          estado: request.estado,
          fechaInicio: request.fechaInicio,
          fechaFin: request.fechaFin,
        }) || {}
      );
    },
  });

  editUser(id: number): void {
    this.router.navigate(['/admin/list-user-admin', id]);
  }

  toggleDropdown(plan: any) {
    this.openDropdownIndex =
      this.openDropdownIndex === plan.id ? null : plan.id;
  }
  openModal(data?: any) {
    this.isModalOpen.set(true);
  }
  closeModal() {
    // Quita el foco de cualquier elemento dentro del modal
    (document.activeElement as HTMLElement)?.blur();
    // O mueve el foco al body
    document.body.focus();
    // Esto asegura que ningún elemento dentro del modal tenga el foco cuando se oculta, evitando el error de accesibilidad.

    // ...tu lógica para cerrar el modal...
    this.isModalOpen.set(false);
  }

  formChange(event: boolean) {
    if (event) this.closeModal();
  }
}
