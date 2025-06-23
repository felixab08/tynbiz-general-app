import { Component, input } from '@angular/core';

@Component({
  selector: 'tyn-user-detail-privilege-page',
  imports: [],
  templateUrl: './user-detail-privilege-page.component.html',
})
export class UserDetailPrivilegePageComponent {
  userInfo = input.required<any>();
}
