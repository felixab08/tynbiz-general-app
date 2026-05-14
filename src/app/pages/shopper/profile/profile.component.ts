import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '@app/auth/interfaces/user.interface';
import { AuthService } from '@app/auth/services/auth.service';
import { StoreService } from '@app/services';
import { LoginComponent } from '@app/shared/login/login.component';
import { ModalComponent } from '@app/shared/modal/modal.component';

@Component({
  selector: 'tyn-profile',
  imports: [LoginComponent, ModalComponent, RouterLink],
  templateUrl: './profile.component.html',
})
export default class ProfileComponent {
  public storeService = inject(StoreService);
  public isLogin: boolean = false;
  public user: User | undefined;
  _authService = inject(AuthService);

  constructor() {
    let user = localStorage.getItem('user');
    if (user) this.storeService.user.next(JSON.parse(user));
    this.storeService.isLoginSubject.subscribe((isLoggedIn) => {
      this.isLogin = isLoggedIn;
    });
    this.storeService.user.subscribe((user) => {
      this.user = user;
    });
  }
  openModal() {
    this.storeService.isLoginSubject.next(true);
  }
  closeModal() {
    this.storeService.isLoginSubject.next(false);
  }
}
