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
  resquestListOrigin = resquestDemoListMock;
  resquestList = this.resquestListOrigin;
  isState = 'All';
  isModalOpen = signal(false);
  selectedSolicDemo: any = true;
  filterResquestList(status: string) {
    return this.resquestListOrigin.filter((item) => item.storeStatus === status);
  }
  changeState(data: any) {
    if (data === 'All') {
      this.resquestList = this.resquestListOrigin;
    } else {
      this.resquestList = [...this.filterResquestList(data)];
    }
  }
  openModal(SolicDemo: any) {
    this.selectedSolicDemo= SolicDemo;
    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
  }
}
