import { Component } from '@angular/core';
import { resquestDemoListMock } from '@app/mock/resquet-demo-list.mock';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'tyn-request-service-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './request-service-page.component.html',
})
export default class RequestServicePageComponent {
  resquestList = resquestDemoListMock;
  isState = 'All';

  filterByStatus(status: string): void {
    const isAll = status === 'All';
    const filteList = isAll
      ? resquestDemoListMock
      : resquestDemoListMock.filter(
          (store) => store.storeStatusService === status
        );
    this.resquestList = [...filteList];
  }
}
