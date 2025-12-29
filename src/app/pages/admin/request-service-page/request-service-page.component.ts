import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { LinkParamService, SuscriptionService } from '@app/services';
import { PaginationComponent } from '@app/components/pagination/pagination.component';
import { Router } from '@angular/router';
import { FilterComponent } from '@app/components/filter/filter.component';
import { ISuscription } from '@app/interfaces';
@Component({
  selector: 'tyn-request-service-page',
  imports: [CommonModule, FormsModule, PaginationComponent, FilterComponent],
  templateUrl: './request-service-page.component.html',
})
export default class RequestServicePageComponent {
  isState: string = 'All';
  isModalOpen = signal(false);
  selectedSolicDemo: ISuscription | null = null;
  selectedTab: string = 'verifyInformation';

  // Filtros
  filterMenu = signal({
    searchShow: true,
    datesShow: true,
    selectShow: true,
    filterSelectList: [
      {
        id: 'EN_REVISION',
        value: 'En revisión',
      },
      {
        id: 'EN_INCORPORACION',
        value: 'En incorporación',
      },
      {
        id: 'INCORPORADO',
        value: 'Incorporado',
      },
    ],
  });

  private _suscriptionService = inject(SuscriptionService);
  _linkService = inject(LinkParamService);
  _router = inject(Router);

  suscriptionResorce = rxResource({
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
        this._suscriptionService.getSuscriptionRequest({
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
  openModal(SolicDemo: any) {
    this._suscriptionService.getSuscriptionById(SolicDemo.id).subscribe({
      next: (resp) => {
        this.selectedSolicDemo = resp;
        this.selectedTab = 'verifyInformation';
        this.isModalOpen.set(true);
      },
      error: (err) => {
        console.error('Error fetching subscription by ID:', err);
      },
    });
  }
  closeModal() {
    this.isModalOpen.set(false);
  }
  sendIncorporationLink() {
    if (!this.selectedSolicDemo) return;
    this._suscriptionService
      .postSuscriptionIncoporateById(this.selectedSolicDemo.id)
      .subscribe({
        next: (resp) => {
          console.log('Incorporation link sent successfully:', resp);
          this.closeModal();
          this.suscriptionResorce.reload();
        },
        error: (err) => {
          console.error('Error sending incorporation link:', err);
        },
      });
  }
}
