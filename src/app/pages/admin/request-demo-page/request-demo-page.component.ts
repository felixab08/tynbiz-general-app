import { Component, signal } from '@angular/core';
import { resquestDemoListMock } from '../../../mock/resquet-demo-list.mock';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tyn-request-demo-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './request-demo-page.component.html',
})
export default class RequestDemoPageComponent {
  resquestList = resquestDemoListMock;
  isState = 'All';
  isModalOpen = signal(false);
  selectedSolicDemo: any = true;

  filterByStatus(status: string): void {
    const isAll = status === 'All';
    const filteList = isAll
      ? resquestDemoListMock
      : resquestDemoListMock.filter((store) => store.storeStatus === status);
    this.resquestList = [...filteList];
  }

  openModal(SolicDemo: any) {
    this.selectedSolicDemo = SolicDemo;
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
