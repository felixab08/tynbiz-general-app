import { Component, inject } from '@angular/core';
import { storePlan } from '@app/mock/plan.mock';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tyn-plan-suscrip-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './plan-suscrip-page.component.html',
})
export default class PlanSuscripPageComponent {
  planStoreList = storePlan;
  selectedPlanList : any = true;
  openDropdownIndex: number | null = null;
  currentPage = 1;
  itemsPerPage = 10;

  toggleDropdown(plan: any) {
    this.selectedPlanList = plan;
    this.openDropdownIndex = this.openDropdownIndex === plan.id ? null : plan.id;
  }


   totalPages() {
    return Math.ceil(this.planStoreList.length / this.itemsPerPage);
  }
  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.planStoreList.slice(start, this.currentPage * this.itemsPerPage);
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

  router = inject(Router);

  openbillingHistory(id: number): void {
    this.router.navigate(['/admin/billingHistory', id]);
  }

}
