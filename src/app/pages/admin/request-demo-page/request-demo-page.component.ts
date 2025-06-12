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
  lang = 'All'; // Default language set to Spanish
  constructor() {
    let data = this.filterResquestList('Pendiente');
    console.log('Felix:::::>');
    console.log(data);

    // Initialization logic can go here if needed
  }
  filterResquestList(status: string) {
    return this.resquestList.filter((item) => item.storeStatus === status);
  }
  myFuncEnglish2(data: any) {
    console.log('Felix:::::>', data);
    // console.log(this.lang);
  }
}
