import { Component, signal } from '@angular/core';
import { plan } from '@app/mock/plan.mock';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanesSuscriptionWarningModalPageComponent } from "./planes-suscription-warning-modal-page/planes-suscription-warning-modal-page.component";
import { PlanesSuscriptionFormModalPageComponent } from './planes-suscription-form-modal-page/planes-suscription-form-modal-page.component';

@Component({
  selector: 'tyn-planes-suscription-page',
  imports: [CommonModule, FormsModule, PlanesSuscriptionWarningModalPageComponent, PlanesSuscriptionFormModalPageComponent],
  templateUrl: './planes-suscription-page.component.html',
})
export default class PlanesSuscriptionPageComponent {
  planList = plan;
  selectedPlan: any = true;

  openDropdownIndex: number | null = null;

  currentPage = 1;
  itemsPerPage = 10;

  modalVisible=false;
  currentAction:'eliminar' | 'activar' = 'eliminar';

  toggleDropdown(plan: any) {
    this.selectedPlan = plan;
    this.openDropdownIndex = this.openDropdownIndex === plan.id ? null : plan.id;

  }



  openModalWar(action: 'eliminar' | 'activar') {
    this.modalVisible = true;
    this.currentAction = action
    this.openDropdownIndex = null;
  }

  confirmAction(){
     if (this.currentAction === 'eliminar') {
      this.planList = this.planList.filter(d => d.id !== this.selectedPlan.id);
    } else if (this.currentAction === 'activar') {
      this.planList = this.planList.map(d =>
        d.id === this.selectedPlan.id ? { ...d, planState: 'activo' } : d
      );
    }
    this.closeModalWar();
  }

  closeModalWar() {
    this.modalVisible=false;
    this.selectedPlan = null;
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
    const index = this.planList.findIndex(p => p.id === planData.id);
    if (index !== -1) {
      this.planList[index] = planData;
    }
  }
  this.closeFormModal();
}
}
