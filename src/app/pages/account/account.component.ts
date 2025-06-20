import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SecurityPrivacityComponent } from './security-privacity/security-privacity.component';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';
import { VerificAccountComponent } from '../../components/verific-account/verific-account.component';
import { LoginComponent } from '../../shared/login/login.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tyn-account',
  imports: [ProfileComponent, SecurityPrivacityComponent, CommonModule],
  templateUrl: './account.component.html',
})
export default class AccountComponent {
  selectedTab: string = 'selectProfile';
}
