import { Component } from '@angular/core';
import { resquestDemoListMock } from '../../../mock/resquet-demo-list.mock';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tyn-request-demo-page',
  imports: [FormsModule],
  templateUrl: './request-demo-page.component.html',
})
export default class RequestDemoPageComponent {
  resquestList = resquestDemoListMock;
  lang = 'All';

  filterByStatus(status: string): void {
    const isAll = status === 'All';
    const filteredList = isAll
      ? resquestDemoListMock
      : resquestDemoListMock.filter((store) => store.storeStatus === status);
    this.resquestList = [...filteredList];
  }
}
