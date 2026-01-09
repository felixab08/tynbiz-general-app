import { Component, inject, signal } from '@angular/core';
import { plan } from '@app/mock/plan.mock';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanesSuscriptionFormModalPageComponent } from './planes-suscription-form-modal-page/planes-suscription-form-modal-page.component';
import { WarningModalComponent } from '@app/components/warning-modal/warning-modal.component';
import { SuccessModalComponent } from '@app/components/success-modal/success-modal.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { LinkParamService, PlanesService } from '@app/services';
import { Router } from '@angular/router';
import { FILTERISACTIVELIST } from '@app/constant';
import { FilterComponent } from '@app/components/filter/filter.component';
import { PaginationComponent } from '@app/components/pagination/pagination.component';

@Component({
  selector: 'tyn-planes-suscription-page',
  imports: [
    CommonModule,
    FormsModule,
    WarningModalComponent,
    PlanesSuscriptionFormModalPageComponent,
    SuccessModalComponent,
    DatePipe,
    FilterComponent,
    PaginationComponent,
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
  _linkService = inject(LinkParamService);
  _router = inject(Router);

  private _planesService = inject(PlanesService);
  // Filtros
  filterMenu = signal({
    searchShow: true,
    datesShow: true,
    selectShow: true,
    filterSelectList: FILTERISACTIVELIST,
  });

  planesResorce = rxResource({
    request: () => ({
      page: this._linkService.currentPage() - 1,
      size: this._linkService.currentSize(),
      status: this._linkService.currentStatus(),
      searchTerm: this._linkService.currentSearchTerm(),
      startDate: this._linkService.currentDateInitialFilter(),
      endDate: this._linkService.currentDateEndFilter(),
    }),
    loader: ({ request }) => {
      return (
        this._planesService.getPlanes({
          page: request.page,
          size: request.size,
          searchTerm: request.searchTerm,
          status: request.status,
          startDate: request.startDate,
          endDate: request.endDate,
        }) || {}
      );
    },
  });
  changeState(state: string): void {
    this._router.navigate([], {
      queryParams: { status: state, page: 1, size: 5 },
      queryParamsHandling: 'merge',
    });
  }
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
      console.log(planData);
    }
    this.closeFormModal();
  }
}
