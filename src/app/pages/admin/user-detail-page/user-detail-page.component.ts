import { CommonModule } from '@angular/common';
import { Component, inject, linkedSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { userActionsMock } from '@app/mock/rol.mock';
import { UserDetailActionsPageComponent } from './user-detail-actions-page/user-detail-actions-page.component';
import { UserDetailPrivilegePageComponent } from './user-detail-privilege-page/user-detail-privilege-page.component';
import { UserDetailSecurityPageComponent } from './user-detail-security-page/user-detail-security-page.component';
import { UserInfoPageComponent } from './user-info-page/user-info-page.component';

@Component({
  selector: 'tyn-user-detail-page',
  imports: [
    CommonModule,
    UserDetailActionsPageComponent,
    UserDetailPrivilegePageComponent,
    UserDetailSecurityPageComponent,
    UserInfoPageComponent,
  ],
  templateUrl: './user-detail-page.component.html',
})
export default class UserDetailPageComponent {
  userActions = [...userActionsMock];
  selectedTab: string = 'selectSecurityUser';
  userInfo: any;
  // signals
  activateRoute = inject(ActivatedRoute);
  router = inject(Router);
  queryParam = inject(ActivatedRoute).snapshot.params['id'];

  constructor() {
    console.log('query:::::>', this.queryParam);
    this.searchUser();
  }
  searchUser(): void {
    this.userInfo = this.userActions.find(
      (user) => user.id === Number(this.queryParam)
    );
  }
  goBack() {
    this.router.navigate(['/admin/list-user']);
  }
}
