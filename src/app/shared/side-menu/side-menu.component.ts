import {
  Component,
  inject,
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
import { StoreService } from '@app/services/store.service';
import { User } from '@app/auth/interfaces/user.interface';
import { AlertComponent } from '@app/components/alert/alert.component';
import { AlertService } from '@app/services/alert.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { MenuService } from '@app/auth/services/menu.service';

@Component({
  selector: 'app-side-menu',
  imports: [
    RouterOutlet,
    NavbarComponent,
    RouterLink,
    AlertComponent,
    RouterLinkActive,
    AsyncPipe,
    NgClass,
  ],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent implements AfterViewInit, OnDestroy {
  public storeService = inject(StoreService);
  _authService = inject(AuthService);
  _menuService = inject(MenuService);
  _alertService = inject(AlertService);
  _router = inject(Router);
  menuItemsAll: any[] = [];
  routerState = '/shop/home';
  user$ = this.storeService.user.asObservable();

  @ViewChild('drawerToggle', { static: true })
  drawerToggle!: ElementRef<HTMLButtonElement>;

  @ViewChild('logoSidebar', { static: true })
  logoSidebar!: ElementRef<HTMLElement>;

  private _observer!: MutationObserver;

  public user: User | undefined;
  constructor() {
    this.storeService.user.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.menuItemsAll = this._menuService.createMenuForRole();
        this.routerState = this._menuService.redirectLinkForRole();
      } else {
        this.menuItemsAll = this._menuService.createMenuForRole();
      }
    });
  }

  openLoginModal() {
    this.storeService.isLoginSubject.next(true);
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
