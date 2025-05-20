import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SecurityPrivacityComponent } from './security-privacity/security-privacity.component';

@Component({
  selector: 'tyn-account',
  imports: [ProfileComponent, SecurityPrivacityComponent],
  templateUrl: './account.component.html',
})
export default class AccountComponent {}
