import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreService } from '@app/services/store.service';
import { ModalComponent } from '../modal/modal.component';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '@app/auth/services/auth.service';
import { User } from '@app/auth/interfaces/user.interface';
import { creationStoreMock } from '@app/mock/creationsStore.mock';
import { NotImagePipe } from '@app/pipes';
import { environment } from '@environments/environment';
import { JitsiService } from '@app/services';
import { INotificationResp } from '@app/interfaces';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ModalComponent, LoginComponent, NotImagePipe, DatePipe],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  public storeService = inject(StoreService);
  public isLogin: boolean = false;
  _authService = inject(AuthService);
  _jitsiService = inject(JitsiService);
  public user: User | undefined;
  public creations = signal<INotificationResp[]>([]);
  environment = environment;

  constructor() {
    let user = localStorage.getItem('user');
    if (user) this.storeService.user.next(JSON.parse(user));

    this.storeService.isLoginSubject.subscribe((isLoggedIn) => {
      this.isLogin = isLoggedIn;
    });

    this.storeService.user.subscribe((user) => {
      this.user = user;
      console.log(user);
      if (user && user.role === 'CLIENT') {
        setTimeout(() => {
          this.notificationSrv();
        }, 1000);
      }
    });
  }

  openModal() {
    this.storeService.isLoginSubject.next(true);
  }

  closeModal() {
    this.storeService.isLoginSubject.next(false);
  }

  requestDemo() {
    const url = `${environment.REQUEST_DEMO_URL}`;
    window.open(url, '_blank');
  }

  notificationSrv() {
    this._jitsiService.getNotificacionWS().subscribe((notifications) => {
      // Handle notifications
      console.log(notifications);
      this.creations.set(notifications);
    });
  }
}
