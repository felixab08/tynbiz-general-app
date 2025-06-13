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
  resquestListOrigin = resquestDemoListMock;
    resquestList = this.resquestListOrigin;
    isState = 'All'; // Default language set to Spanish
    filterResquestList(status: string) {
      return this.resquestListOrigin.filter((item) => item.storeStatusService === status);
    }
    ChangeState(data: any) {
      if (data === 'All') {
        this.resquestList = this.resquestListOrigin;
      } else {
        this.resquestList = [...this.filterResquestList(data)];
      }
    }
}
