import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  menuAdmin,
  menuClient,
  menuClientGuest,
  menuOwner,
} from '@app/auth/data/menu.data';
import { MenuItem } from '@app/auth/interfaces/menu.interface';
import { UserRole } from '@app/auth/interfaces/user.interface';
import { StoreService } from '@app/services';

/** Ruta de inicio de cada rol. El anónimo entra como comprador. */
export const HOME_LINK_BY_ROLE: Record<UserRole, string> = {
  ADMIN: '/admin/panel',
  'SUPER-ADMIN': '/admin/panel',
  STORE_OWNER: '/stores/init-store',
  CLIENT: '/shop/home',
};

export const DEFAULT_HOME_LINK = '/shop/home';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly _router = inject(Router);
  private readonly _storeService = inject(StoreService);

  /**
   * El usuario vive en `StoreService`; se proyecta a signal con `toSignal`
   * para que el menú derive de forma reactiva. Antes se cacheaba en un campo
   * con una suscripción que nunca se cancelaba, lo que dejaba el menú y la
   * redirección desincronizados tras un logout.
   */
  private readonly user = toSignal(this._storeService.user, {
    initialValue: undefined,
  });

  /** Menú del rol actual. `computed` para que el template lo lea reactivamente. */
  readonly menuItems = computed<MenuItem[]>(() => {
    const role = this.user()?.role;

    if (!role) {
      return menuClientGuest;
    }

    switch (role) {
      case 'ADMIN':
      case 'SUPER-ADMIN':
        return menuAdmin;
      case 'STORE_OWNER':
        return menuOwner;
      case 'CLIENT':
        return menuClient;
      default:
        return menuClientGuest;
    }
  });

  /** Ruta a la que debe ir este usuario: la de su rol, o el home si es anónimo. */
  homeLinkForRole(): string {
    const role = this.user()?.role;
    return role ? (HOME_LINK_BY_ROLE[role] ?? DEFAULT_HOME_LINK) : DEFAULT_HOME_LINK;
  }

  /** Navega a la home del rol. No recarga la SPA. */
  redirectLinkForRole(): void {
    void this._router.navigateByUrl(this.homeLinkForRole());
  }
}
