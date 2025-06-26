import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { SimpleCardComponent } from '@app/components/simple-card/simple-card.component';
import { SuccessModalComponent } from '@app/components/success-modal/success-modal.component';
import { WarningModalComponent } from '@app/components/warning-modal/warning-modal.component';
import { paymentMethodsStats } from '@app/mock/paymentMethods.mock';
import { Router } from '@angular/router';


@Component({
  selector: 'tyn-payment-page',
  imports: [CommonModule, WarningModalComponent, SimpleCardComponent, SuccessModalComponent],
  templateUrl: './payment-page.component.html',
})
export default class PaymentPageComponent {
  listMethods = paymentMethodsStats;
  selectedMethod: any = true;
  openDropdownIndex: number | null = null;
  modalVisible = false;
  successModalVisible = false;
  itemName: string = ''
  currentAction: 'activar' | 'desactivar' = 'activar';
  successType: 'success' | 'error' | 'warning' = 'success'
  _router = inject(Router);

  toggleDropdown(method: any) {
    this.selectedMethod = method;
    this.openDropdownIndex = this.openDropdownIndex === method.id ? null : method.id;

  }
  openModalWar(action: 'activar' | 'desactivar') {
    this.modalVisible = true;
    this.currentAction = action
    this.openDropdownIndex = null;
  }
  closeModalWar() {
    this.modalVisible = false;
    this.selectedMethod = null;
  }
  closeSuccessModal() {
    this.successModalVisible = false;
  }

  confirmAction() {
    this.modalVisible = false;
    this.itemName = this.selectedMethod.title
    if (this.currentAction === 'desactivar') {
      const item = this.selectedMethod;
      if (item.estate === 'inactivo') {
        this.successType = 'warning';
      } else {
        this.listMethods = this.listMethods.map(d =>
          d.id === item.id ? { ...d, estate: 'inactivo' } : d
        );
        this.successType = 'success';
      }
    } else if (this.currentAction === 'activar') {
      const item = this.selectedMethod;
      if (item.estate === 'activo') {
        this.successType = 'warning';
      } else {
        this.listMethods = this.listMethods.map(d =>
          d.id === item.id ? { ...d, estate: 'activo' } : d
        );
        this.successType = 'success';
      }
    } else if (this.currentAction === 'eliminar') {
      // Supongamos que hay restricción para eliminar
      if (this.selectedMethod.noSePuedeEliminar) {
        this.successType = 'error'
      } else {
        this.listMethods = this.listMethods.filter(d => d.id !== this.selectedMethod.id);
        this.successType = 'success';
      }
    }
    this.successModalVisible = true;
  }
   routeLink(link: string) {
    this._router.navigate([`/admin/${link}`]);
  }
}
