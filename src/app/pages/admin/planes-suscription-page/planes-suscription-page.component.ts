import { Component, signal } from '@angular/core';
import { plan } from '@app/mock/plan.mock';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tyn-planes-suscription-page',
  imports: [CommonModule,FormsModule],
  templateUrl: './planes-suscription-page.component.html',
})
export default class PlanesSuscriptionPageComponent {
  planList = plan;
  selectedPlan: any = true;

  openDropdownIndex: number | null = null;
  isModalOpen =  signal(false)
  isModalWarOpen = signal(false);

  selectedTypePlan: string = 'uso de Tynbiz';

  currentPage = 1;
  itemsPerPage = 10;

  isOffer: boolean = true;

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



}
