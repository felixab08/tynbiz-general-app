import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { plan } from '@app/mock/plan.mock';

@Component({
  selector: 'tyn-planes-suscription-page',
  imports: [CommonModule],
  templateUrl: './planes-suscription-page.component.html',
})
export default class PlanesSuscriptionPageComponent {
  planList = plan;
  selectedPlan: any = true;

  openDropdownIndex: number | null = null;
  isModalOpen =  signal(false)
  isModalWarOpen = signal(false);

  selectedTypePlan: string = '';
  toggleDropdown(plan: any) {
    this.selectedPlan = plan;
    this.openDropdownIndex = this.openDropdownIndex === plan.id ? null : plan.id;

  }
  openModalWar() {
    this.isModalWarOpen.set(true);
    this.openDropdownIndex = null;
  }
  closeModalWar() {
    this.isModalWarOpen.set(false);
  }
  openModal(){
    this.isModalOpen.set(true)
  }
  closeModal(){
    this.isModalOpen.set(false)
  }



}
