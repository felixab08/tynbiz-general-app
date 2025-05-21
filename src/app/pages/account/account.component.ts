import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SecurityPrivacityComponent } from './security-privacity/security-privacity.component';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';
import { VerificAccountComponent } from '../../components/verific-account/verific-account.component';

@Component({
  selector: 'tyn-account',
  imports: [
    ProfileComponent,
    SecurityPrivacityComponent,
    ChangePasswordComponent,
    VerificAccountComponent,
  ],
  templateUrl: './account.component.html',
})
export default class AccountComponent {}
