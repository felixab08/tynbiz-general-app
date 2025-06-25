import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SimpleCardComponent } from '@app/components/simple-card/simple-card.component';
import { WarningModalComponent } from '@app/components/warning-modal/warning-modal.component';
import { paymentMethodsStats } from '@app/mock/paymentMethods.mock';


@Component({
  selector: 'tyn-payment-page',
  imports: [CommonModule, WarningModalComponent, SimpleCardComponent],
  templateUrl: './payment-page.component.html',
})
export default class PaymentPageComponent {
  listMethods = paymentMethodsStats ;
  selectedMethod: any = true;
  openDropdownIndex: number | null = null;
  modalVisible=false;
  currentAction:'activar' | 'desactivar' = 'activar';

  toggleDropdown(method: any) {
    this.selectedMethod = method;
    this.openDropdownIndex = this.openDropdownIndex === method.id ? null : method.id;

  }

  openModalWar(action: 'activar' | 'desactivar') {
    this.modalVisible = true;
    this.currentAction = action
    this.openDropdownIndex = null;
  }

  confirmAction(){
     if (this.currentAction === 'desactivar') {
      this.listMethods = this.listMethods.map(d =>
        d.id === this.selectedMethod.id ? { ...d, estate: 'inactivo' } : d
      );
    } else if (this.currentAction === 'activar') {
      this.listMethods = this.listMethods.map(d =>
        d.id === this.selectedMethod.id ? { ...d, estate: 'activo' } : d
      );
    }
    this.closeModalWar();
  }
  closeModalWar() {
    this.modalVisible=false;
    this.selectedMethod = null;
  }
}
