import { Component, inject, input, output } from '@angular/core';
import { User } from '@app/auth/interfaces/user.interface';
import { IPublicStore } from '@app/interfaces';
import { AlertService, StoreService, StoresService } from '@app/services';

@Component({
  selector: 'tyn-stores-card',
  imports: [],
  templateUrl: './stores-card.component.html',
})
export class StoresCardComponent {
  public storeService = inject(StoreService);
  public isLogin: boolean = false;
  public user: User | undefined;

  listStores = input.required<IPublicStore>();
  _storesSrv = inject(StoresService);
  _alertService = inject(AlertService);

  isFavorite = output<{ storeId: number; isFavorite: boolean }>();

  constructor() {
    let user = localStorage.getItem('user');
    if (user) this.storeService.user.next(JSON.parse(user));

    this.storeService.isLoginSubject.subscribe((isLoggedIn) => {
      this.isLogin = isLoggedIn;
      console.log(this.isLogin);
    });

    this.storeService.user.subscribe((user) => {
      this.user = user;
      console.log(this.user);
    });
  }

  addStoreFavorite(storeId: number) {
    console.log(storeId);
    this._storesSrv.postAddFavoriteStore(storeId).subscribe({
      next: (res) => {
        this._alertService.getAlert(
          'Éxito',
          'Tienda agregada a favoritos',
          'success',
          3000,
        );
        this.isFavorite.emit({ storeId, isFavorite: true });
        console.log(res);
      },
      error: (err) => {
        this._alertService.getAlert(
          'Error',
          'No se pudo agregar la tienda a favoritos',
          'error',
          3000,
        );
        console.log(err);
      },
    });
  }

  deleteStoreFavorite(storeId: number) {
    this._storesSrv.deleteAddFavoriteStore(storeId).subscribe({
      next: (res) => {
        this._alertService.getAlert(
          'Éxito',
          'Tienda eliminada de favoritos',
          'success',
          3000,
        );
        this.isFavorite.emit({ storeId, isFavorite: false });
        console.log(res);
      },
      error: (err) => {
        this._alertService.getAlert(
          'Error',
          'No se pudo eliminar la tienda de favoritos',
          'error',
          3000,
        );
        console.log(err);
      },
    });
  }
}
