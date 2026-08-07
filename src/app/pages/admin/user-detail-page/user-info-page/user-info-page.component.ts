import { DatePipe } from '@angular/common';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tyn-user-info-page',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './user-info-page.component.html',
})
export class UserInfoPageComponent {
  userInfo = input.required<any>();
}
