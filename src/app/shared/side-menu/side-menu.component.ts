import {
  Component,
  effect,
  inject,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet, RouterLinkActive } from '@angular/router';
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
  imports: [RouterOutlet, NavbarComponent, RouterLink, AlertComponent, RouterLinkActive, NgClass],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent implements AfterViewInit, OnDestroy {

  _authService = inject(AuthService);
  _alertService = inject(AlertService);
  _router = inject(Router);
  menuItemsAll: any[] = [...menuItemsMock];

  @ViewChild('drawerToggle', { static: true })
  drawerToggle!: ElementRef<HTMLButtonElement>;

  @ViewChild('logoSidebar', { static: true })
  logoSidebar!: ElementRef<HTMLElement>;

  private _observer!: MutationObserver;

  public storeService = inject(StoreService);
  public user: User | undefined;

  constructor() {
    this.storeService.user.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.menuItemsAll = this.user?.role.includes('STORE_OWNER')
          ? [...menuItemsClienteMock]
          : [...menuAdminMock];
      } else {
        this.menuItemsAll = [...menuItemsMock];
        this._router.navigate(['/']);
      }
    });
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
// Email    : admin@tynby.com
// Password : Admin123!
// Role     : ADMIN

// Email:    owner@tynby.com
// Password: Admin123!
// Role:     STORE_OWNER (dueño de las 3 tiendas)

// Email:    user@tynby.com
// Password: Admin123!
// Role:     STORE_USER
