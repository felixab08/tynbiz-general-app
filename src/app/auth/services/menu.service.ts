import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  menuAdminMock,
  menuItemsClienteMock,
  menuItemsMock,
} from '@app/auth/data/menu.data';
import { StoreService } from '@app/services';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private _router = inject(Router);
  private _storeService = inject(StoreService);
  private user: User | undefined;

  constructor() {
    this._storeService.user.subscribe((user) => {
      this.user = user;
    });
  }

  createMenuForRole() {
    if (!this.user) {
      // this._router.navigate(['/shop/home']);
      return menuItemsMock.splice(0, 4);
    }
    switch (this.user?.role) {
      case 'ADMIN':
        return menuAdminMock;
      case 'STORE_OWNER':
        return menuItemsClienteMock;
      case 'CLIENT':
        return menuItemsMock;
      default:
        return menuItemsMock.splice(0, 4);
    }
  }

  redirectLinkForRole() {
    if (!this.user) {
      this._router.navigate(['/shop/home']);
    }
    switch (this.user?.role) {
      case 'ADMIN':
        this._router.navigate(['/admin/panel']);
        break;
      case 'STORE_OWNER':
        this._router.navigate(['/stores/init-store']);
        break;
      case 'CLIENT':
        this._router.navigate(['/shop/home']);
        break;
      default:
        this._router.navigate(['/shop/home']);
        break;
    }
  }
}
