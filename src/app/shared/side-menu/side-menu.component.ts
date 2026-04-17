import {
  Component,
  inject,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterOutlet,
  RouterLinkActive,
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
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-side-menu',
  imports: [
    RouterOutlet,
    NavbarComponent,
    RouterLink,
    AlertComponent,
    RouterLinkActive,
    NgClass,
  ],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent implements AfterViewInit, OnDestroy {
  _authService = inject(AuthService);
  _alertService = inject(AlertService);
  _router = inject(Router);
  menuItemsAll: any[] = [...menuItemsMock];
  routerState = '/shop/home';
  @ViewChild('drawerToggle', { static: true })
  drawerToggle!: ElementRef<HTMLButtonElement>;

  @ViewChild('logoSidebar', { static: true })
  logoSidebar!: ElementRef<HTMLElement>;

  private _observer!: MutationObserver;

  public storeService = inject(StoreService);
  public user: User | undefined;
  typeRole = [
    { id: 1, type: 'PAY_PER_USE', name: 'Pago por uso' },
    { id: 2, type: 'MONTHLY', name: 'Pago mensual' },
    { id: 3, type: 'YEARLY', name: 'Pago anual' },
  ];

  constructor() {
    this.storeService.user.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.menuItemsAll = this.user?.role.includes('STORE_OWNER')
          ? [...menuItemsClienteMock]
          : [...menuAdminMock];
        // TODO: revisar rutas para cada rol y descomentar esta parte
        // this.routerState = this.user?.role.includes('STORE_OWNER')
        //   ? '/stores/init-store'
        //   : '/admin/dashboard';
        // this._router.navigate([this.routerState]);
      } else {
        this.menuItemsAll = [...menuItemsMock];
        // this.routerState = '/';
        this._router.navigate(['/']);
      }
    });
    localStorage.setItem('typeRole', JSON.stringify(this.typeRole[0]));
  }

  ngAfterViewInit(): void {
    try {
      const sidebarEl = this.logoSidebar?.nativeElement;
      const toggleBtn = this.drawerToggle?.nativeElement;
      if (!sidebarEl || !toggleBtn) return;

      this._observer = new MutationObserver(() => {
        const hiddenByAria = sidebarEl.getAttribute('aria-hidden') === 'true';
        const hiddenByClass = sidebarEl.classList.contains('-translate-x-full');
        const hidden = hiddenByAria || hiddenByClass;
        const active = document.activeElement as HTMLElement | null;

        if (hidden && active && sidebarEl.contains(active)) {
          toggleBtn.focus();
        }
      });

      this._observer.observe(sidebarEl, {
        attributes: true,
        attributeFilter: ['class', 'aria-hidden'],
      });
    } catch (e) {
      // don't block app on observer errors
      console.warn('SideMenu: could not attach MutationObserver', e);
    }
  }

  ngOnDestroy(): void {
    try {
      this._observer?.disconnect();
    } catch (e) {
      // ignore
    }
  }
}
