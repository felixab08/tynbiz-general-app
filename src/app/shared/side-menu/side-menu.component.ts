import {
  Component,
  inject,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterOutlet,
  RouterLinkActive,
  NavigationEnd,
} from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '@app/auth/services/auth.service';
import { StoreService } from '@app/services/store.service';
import { User } from '@app/auth/interfaces/user.interface';
import { AlertComponent } from '@app/components/alert/alert.component';
import { AlertService } from '@app/services/alert.service';
import { CommonModule, NgClass } from '@angular/common';
import { MenuService } from '@app/auth/services/menu.service';
import { ModalComponent } from '../modal/modal.component';
import { CreateInteraction } from '../create-interaction/create-interaction';
import { initCollapses } from 'flowbite';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-side-menu',
  imports: [
    RouterOutlet,
    NavbarComponent,
    RouterLink,
    AlertComponent,
    RouterLinkActive,
    CommonModule,
    ModalComponent,
    CreateInteraction,
    LoginComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Breakpoint `sm` de Tailwind (640px). Debe coincidir con el
   *  `sm:translate-x-0` de los `<aside>`: por debajo el menú es un drawer,
   *  por encima es fijo y no se oculta. */
  private static readonly MOBILE_BREAKPOINT = 640;

  storeService = inject(StoreService);
  _authService = inject(AuthService);
  _menuService = inject(MenuService);
  _alertService = inject(AlertService);
  _router = inject(Router);
  menuItemsAll: any[] = [];
  user$ = this.storeService.user.asObservable();
  public isLogin: boolean = false;

  /** true en viewports menores a `sm`, donde el `<aside>` se comporta como drawer. */
  public isMobile: boolean =
    window.innerWidth < SideMenuComponent.MOBILE_BREAKPOINT;

  /** Estado del drawer del menú lateral.
   *
   * Solo aplica a STORE_OWNER y ADMIN, que son los únicos roles con botón
   * hamburguesa. CLIENT y anónimo navegan en móvil con `nav#bottom-navigation`.
   *
   * Lo controla Angular en lugar del `Drawer` de Flowbite. Ese componente
   * inyectaba el backdrop como hijo de `<body>` con la clase fija
   * `bg-dark-backdrop/70 fixed inset-0 z-30`. Como `.side-init`
   * (`isolation: isolate` + `z-1`) y `app-side-menu` (`relative` + `z-2`)
   * crean contextos de apilamiento propios, el `<aside>` (`z-40`) nunca podía
   * competir con ese `z-30` de nivel raíz: quedaba por debajo del backdrop y
   * sus enlaces no recibían los clics. Al renderizar el backdrop dentro de esta
   * plantilla ambos comparten contexto, y `z-30` < `z-40` resuelve correcto. */
  public isSidebarOpen: boolean = false;

  public isOpen: boolean = false;
  public isScrolled: boolean = false;

  @ViewChild('drawerToggle')
  drawerToggle?: ElementRef<HTMLButtonElement>;

  @ViewChild('logoSidebar')
  logoSidebar?: ElementRef<HTMLElement>;

  public user: User | undefined;

  private _routerSub?: Subscription;

  constructor() {
    this.storeService.user.subscribe((user) => {
      this.user = user;
      this.menuItemsAll = this._menuService.createMenuForRole();
    });
    this.storeService.isLoginSubject.subscribe((isLoggedIn) => {
      this.isLogin = isLoggedIn;
    });
  }

  get isProfilePage(): boolean {
    return this._router.url.includes('/shop/profile');
  }

  openLoginModal() {
    if (!this.user) {
      this.storeService.isLoginSubject.next(true);
      this._alertService.getAlert(
        'Alerta',
        'Inicia sesión para poder acceder a la sala',
        'warning',
      );
    } else {
      this.isOpen = true;
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 0;
  }

  ngOnInit(): void {
    // Al navegar se cierra el menú: en móvil el drawer se quedaba abierto
    // encima de la página y tapaba el contenido.
    this._routerSub = this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      )
      .subscribe(() => this.closeSidebar());
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    if (!this.isSidebarOpen) return;
    this.isSidebarOpen = false;

    // Si el foco estaba dentro del menú, vuelve al botón que lo abrió para que
    // no quede en un enlace invisible tras el `-translate-x-full`.
    const sidebarEl = this.logoSidebar?.nativeElement;
    const active = document.activeElement as HTMLElement | null;
    if (sidebarEl && active && sidebarEl.contains(active)) {
      this.drawerToggle?.nativeElement.focus();
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    const isMobile = window.innerWidth < SideMenuComponent.MOBILE_BREAKPOINT;
    if (isMobile === this.isMobile) return;
    this.isMobile = isMobile;
    // Al pasar a escritorio el `<aside>` siempre está visible: el drawer se cierra.
    this.closeSidebar();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeSidebar();
  }

  ngAfterViewInit(): void {
    try {
      // Los submenús (`data-collapse-toggle`) siguen usando Flowbite.
      // `initDrawers()` ya no se usa: el drawer del menú lo maneja Angular.
      initCollapses();
    } catch (e) {
      console.warn('SideMenu: could not init collapses', e);
    }
  }

  ngOnDestroy(): void {
    this._routerSub?.unsubscribe();
  }

  closeModal() {
    this.isOpen = false;
  }

  openModalModal() {
    this.storeService.isLoginSubject.next(true);
  }

  closeModalModal() {
    this.storeService.isLoginSubject.next(false);
  }
}
