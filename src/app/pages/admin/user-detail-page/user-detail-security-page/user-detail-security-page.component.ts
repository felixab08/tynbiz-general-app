import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'tyn-user-detail-security-page',
  imports: [CommonModule],
  templateUrl: './user-detail-security-page.component.html',
})
export class UserDetailSecurityPageComponent {
  userInfo = input.required<any>();
}
