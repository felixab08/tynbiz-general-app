import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { userActionsMock } from '@app/mock/rol.mock';
import { CreateUserFormComponent } from '../../../components/create-user-form/create-user-form.component';

@Component({
  selector: 'tyn-list-user-admin-page',
  imports: [CommonModule, FormsModule, DatePipe, CreateUserFormComponent],
  templateUrl: './list-user-admin-page.component.html',
})
export default class ListUserAdminPageComponent {
  userActions = [...userActionsMock];
  isState = 'All';
  // paginacion
  currentPage = 1;
  itemsPerPage = 5;
  // Filtros por fecha
  search = '';
  startDate: string = '';
  endDate: string = '';

  openDropdownIndex: number | null = null;
  isModalOpen = signal(false);

  router = inject(Router);

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
