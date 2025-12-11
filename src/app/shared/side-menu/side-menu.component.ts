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
        this.menuItemsAll = this.user?.role.includes('STORE_OWNER')
          ? [...menuItemsClienteMock]
          : [...menuAdminMock];
        this.user?.role.includes('STORE_USER')
          ? this._router.navigate(['/stores'])
          : this._router.navigate(['/admin']);
      } else {
        this.menuItemsAll = [...menuItemsMock];
        this._router.navigate(['/']);
      }
    });
  }
}
// Email    : admin@tynby.com
// Password : Admin123!
// Role     : ADMIN

// Email:    owner@tynby.com
// Password: Admin123!
// Role:     STORE_OWNER (dueño de las 3 tiendas)

// Email:    user@tynby.com
// Password: Admin123!
// Role:     STORE_USER
