import { Component, effect, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '@app/auth/services/auth.service';
import {
  menuAdminMock,
  menuItemsClienteMock,
  menuItemsMock,
} from '@app/mock/menu.mock';

@Component({
  selector: 'app-side-menu',
  imports: [RouterOutlet, NavbarComponent, RouterLink],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent {
  _authService = inject(AuthService);
  menuItemsAll: any[] = [];
  menuItemsCliente = [...menuItemsClienteMock];
  menuItems = [...menuItemsMock];
  menuAdmin = [...menuAdminMock];
  debounceEffect = effect(() => {
    let user: any = this._authService.user;
    console.log('========================>', user);
    if (user) {
      this.menuItemsAll =
        user.role === 'moderator'
          ? [...this.menuItemsCliente]
          : [...this.menuItems];
      if (user.role === 'admin') {
        this.menuItemsAll = [...this.menuAdmin];
      }
    }
  });
}
