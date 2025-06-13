import { Component } from '@angular/core';
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
  lang = 'All';
  filterResquestList(status: string) {
    return this.resquestListOrigin.filter((item) => item.storeStatus === status);
  }
  ChangeState(data: any) {
    if (data === 'All') {
      this.resquestList = this.resquestListOrigin;
    } else {
      this.resquestList = this.filterResquestList(data);
    }
  }
}
