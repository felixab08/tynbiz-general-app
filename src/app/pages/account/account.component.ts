import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SecurityPrivacityComponent } from './security-privacity/security-privacity.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tyn-account',
  imports: [ProfileComponent, SecurityPrivacityComponent, CommonModule],
  templateUrl: './account.component.html',
})
export default class AccountComponent {
  selectedTab: string = 'selectProfile';
}
