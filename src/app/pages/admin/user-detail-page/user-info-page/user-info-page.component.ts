import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'tyn-user-info-page',
  imports: [DatePipe],
  templateUrl: './user-info-page.component.html',
})
export class UserInfoPageComponent {
  userInfo = input.required<any>();
}
