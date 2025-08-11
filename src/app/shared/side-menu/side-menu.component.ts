import { Component, effect, inject, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '@app/auth/services/auth.service';
import {
  menuAdminMock,
  menuItemsClienteMock,
  menuItemsMock,
} from '@app/mock/menu.mock';
import { StoreService } from '@app/services/store.service';
import { User } from '@app/auth/interfaces/user.interface';
import { AlertComponent } from '@app/components/alert/alert.component';
import { AlertI } from '@app/interfaces/alert.interface';
import { AlertService } from '@app/services/alert.service';

@Component({
  selector: 'app-side-menu',
  imports: [RouterOutlet, NavbarComponent, RouterLink, AlertComponent],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent {
  _authService = inject(AuthService);
  _alertService = inject(AlertService);
  _router = inject(Router);
  menuItemsAll: any[] = [...menuItemsMock];

  public storeService = inject(StoreService);
  public user: User | undefined;

  constructor() {
    this.storeService.user.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.menuItemsAll = this.user?.roles.includes('moderator')
          ? [...menuItemsClienteMock]
          : [...menuAdminMock];
        this.user?.roles.includes('moderator')
          ? this._router.navigate(['/stores'])
          : this._router.navigate(['/admin']);
      } else {
        this.menuItemsAll = [...menuItemsMock];
        this._router.navigate(['/']);
      }
    });
  }
}
