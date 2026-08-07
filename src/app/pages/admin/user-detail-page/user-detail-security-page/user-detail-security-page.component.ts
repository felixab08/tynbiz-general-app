import { CommonModule } from '@angular/common';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tyn-user-detail-security-page',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './user-detail-security-page.component.html',
})
export class UserDetailSecurityPageComponent {
  userInfo = input.required<any>();
}
