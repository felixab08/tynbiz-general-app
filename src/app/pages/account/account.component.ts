import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@app/auth/interfaces/user.interface';
import { StoreService } from '@app/services';
import { ProfileComponent } from './profile/profile.component';
import { ProfileStoreComponent } from './profile-store/profile-store';
import { SecurityPrivacityComponent } from './security-privacity/security-privacity.component';

@Component({
  selector: 'tyn-account',
  imports: [
    ProfileComponent,
    ProfileStoreComponent,
    SecurityPrivacityComponent,
    CommonModule,
  ],
  templateUrl: './account.component.html',
})
export default class AccountComponent {
  selectedTab: string = 'selectProfile';
  public storeService = inject(StoreService);
  public user: User | undefined;
  constructor() {
    this.storeService.user.subscribe((user) => {
      this.user = user;
      console.log(user);
    });
  }
}
