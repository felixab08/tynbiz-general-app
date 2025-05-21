import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SecurityPrivacityComponent } from './security-privacity/security-privacity.component';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';
import { VerificAccountComponent } from '../../components/verific-account/verific-account.component';
import { LoginComponent } from '../../shared/login/login.component';

@Component({
  selector: 'tyn-account',
  imports: [
    ProfileComponent,
    SecurityPrivacityComponent,
    ChangePasswordComponent,
    VerificAccountComponent,
    LoginComponent,
  ],
  templateUrl: './account.component.html',
})
export default class AccountComponent {}
