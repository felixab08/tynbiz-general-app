import { Component, inject, signal } from '@angular/core';
import { plan } from '@app/mock/plan.mock';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanesSuscriptionFormModalPageComponent } from './planes-suscription-form-modal-page/planes-suscription-form-modal-page.component';
import { WarningModalComponent } from '@app/components/warning-modal/warning-modal.component';
import { SuccessModalComponent } from '@app/components/success-modal/success-modal.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { PlanesService } from '@app/services';

@Component({
  selector: 'tyn-planes-suscription-page',
  imports: [
    CommonModule,
    FormsModule,
    WarningModalComponent,
    PlanesSuscriptionFormModalPageComponent,
    SuccessModalComponent,
    DatePipe,
  ],
  templateUrl: './planes-suscription-page.component.html',
})
export default class PlanesSuscriptionPageComponent {
  planList = plan;
  selectedPlan: any = true;

  openDropdownIndex: number | null = null;

  currentPage = 1;
  itemsPerPage = 10;
  itemName: string = '';
  modalVisible = false;
  successModalVisible = false;
  currentAction: 'eliminar' | 'activar' = 'eliminar';
  successType: 'success' | 'error' | 'warning' = 'success';

  private _planesService = inject(PlanesService);

  planesResorce = rxResource({
    request: () => ({
      isActive: true,
      isPublic: true,
    }),
    loader: ({ request }) => {
      return (
        this._planesService.getPlanes({
          isActive: request.isActive,
          isPublic: request.isPublic,
        }) || {}
      );
    },
  });

  toggleDropdown(plan: any) {
    this.selectedPlan = plan;
    this.openDropdownIndex =
      this.openDropdownIndex === plan.id ? null : plan.id;
  }

  openModalWar(action: 'eliminar' | 'activar') {
    this.modalVisible = true;
    this.currentAction = action;
    this.openDropdownIndex = null;
  }
  closeModalWar() {
    this.modalVisible = false;
    this.selectedPlan = null;
  }
  closeSuccessModal() {
    this.successModalVisible = false;
  }

  confirmAction() {
    this.modalVisible = false;
    this.itemName = this.selectedPlan.title;

    if (this.currentAction === 'activar') {
      const item = this.selectedPlan;
      if (item.estate === 'activo') {
        this.successType = 'warning';
      } else {
        this.planList = this.planList.map((d) =>
          d.id === this.selectedPlan.id ? { ...d, planState: 'activo' } : d
        );
        this.successType = 'success';
      }
    } else if (this.currentAction === 'eliminar') {
      // Supongamos que hay restricción para eliminar
      if (this.selectedPlan.noSePuedeEliminar) {
        this.successType = 'error';
      } else {
        this.planList = this.planList.filter(
          (d) => d.id !== this.selectedPlan.id
        );
        this.successType = 'success';
      }
    }
    this.successModalVisible = true;
  }

  totalPages() {
    return Math.ceil(this.planList.length / this.itemsPerPage);
  }
  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.planList.slice(start, this.currentPage * this.itemsPerPage);
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

  //
  formModalVisible = signal(false);
  modalMode: 'crear' | 'editar' = 'crear';

  openFormModal(mode: 'crear' | 'editar', plan: any = null) {
    this.modalMode = mode;
    this.selectedPlan = plan;
    this.formModalVisible.set(true);
    this.openDropdownIndex = null;
  }

  closeFormModal() {
    this.formModalVisible.set(false);
    this.selectedPlan = null;
  }

  onSavePlan(planData: any) {
    if (this.modalMode === 'crear') {
      this.planList.push(planData);
    } else {
      const index = this.planList.findIndex((p) => p.id === planData.id);
      if (index !== -1) {
        this.planList[index] = planData;
      }
    }
    this.closeFormModal();
  }
}
