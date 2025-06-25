import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { storePlan } from '@app/mock/plan.mock';

@Component({
  selector: 'tyn-billing-history-page',
  imports: [],
  templateUrl: './billingHistory-page.component.html',
})
export default class BillingHistoryPageComponent {

  router = inject(Router);
  billingHistoryStore = [...storePlan];
  billingHistoryInfo: any;
  activateRoute = inject(ActivatedRoute);
  queryParam = inject(ActivatedRoute).snapshot.params['id'];

  constructor() {
    console.log('query:::::>', this.queryParam);
    this.searchUser();
  }
  searchUser(): void {
    this.billingHistoryInfo = this.billingHistoryStore.find(
      (user) => user.id === Number(this.queryParam)
    );
  }
  goBack() {
    this.router.navigate(['/admin/plan-suscript']);
  }
  openDropdownIndex: number | null = null;

  toggleDropdown(plan: any) {

    this.openDropdownIndex = this.openDropdownIndex === plan.id ? null : plan.id;
  }
}
