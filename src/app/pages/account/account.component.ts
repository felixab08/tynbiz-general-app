import { Component, inject } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SecurityPrivacityComponent } from './security-privacity/security-privacity.component';
import { CommonModule } from '@angular/common';
import { User } from '@app/auth/interfaces/user.interface';
import { StoreService } from '@app/services';

@Component({
  selector: 'tyn-account',
  imports: [ProfileComponent, SecurityPrivacityComponent, CommonModule],
  templateUrl: './account.component.html',
})
export default class AccountComponent {
  selectedTab: string = 'selectProfile';
  public storeService = inject(StoreService);
  public user: User | undefined;
  constructor() {
    this.storeService.user.subscribe((user) => {
      this.user = user;
      console.log('User in AccountComponent:', this.user);
    });
  }
}
