import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreService } from '@app/services/store.service';
import { ModalComponent } from "../modal/modal.component";
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ModalComponent, LoginComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  public storeService = inject(StoreService);
  public isLogin: boolean = false;

  constructor() {
    this.storeService.isLoginSubject.subscribe((isLoggedIn) => {
      this.isLogin = isLoggedIn;
    });
  }

  openModal() {
    this.storeService.isLoginSubject.next(true);
  }

  closeModal() {
    this.storeService.isLoginSubject.next(false);
  }
}
