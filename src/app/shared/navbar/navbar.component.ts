import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreService } from '@app/services/store.service';
import { ModalComponent } from '../modal/modal.component';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '@app/auth/services/auth.service';
import { User } from '@app/auth/interfaces/user.interface';
import { creationStoreMock } from '@app/mock/creationsStore.mock';
import { NotImagePipe } from '@app/pipes';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ModalComponent, LoginComponent, NotImagePipe],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  public storeService = inject(StoreService);
  public isLogin: boolean = false;
  _authService = inject(AuthService);
  public user: User | undefined;
  public creations = creationStoreMock;
  environment = environment;

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

  requestDemo() {
    const url = `${environment.REQUEST_DEMO_URL}`;
    window.open(url, '_blank');
  }
}
