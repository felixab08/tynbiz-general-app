import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '@app/auth/interfaces/user.interface';
import { AuthService } from '@app/auth/services/auth.service';
import { StoreService } from '@app/services';
import { environment } from '@environments/environment';

@Component({
  selector: 'tyn-profile-client',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './profile.component.html',
})
export default class ProfileClientComponent {
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
      if (user) this.user = user;
    });
  }
  requestDemo() {
    const url = `${environment.REQUEST_DEMO_URL}`;
    window.open(url, '_blank');
  }

  openModal() {
    if (!this.user) this.storeService.isLoginSubject.next(true);
  }
  closeModal() {
    this.storeService.isLoginSubject.next(false);
  }
}
