import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { initDropdowns } from 'flowbite';
import { RouterLink } from '@angular/router';
import { StoreService } from '@app/services/store.service';
import { ModalComponent } from '../modal/modal.component';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '@app/auth/services/auth.service';
import { User } from '@app/auth/interfaces/user.interface';
import { NotImagePipe } from '@app/pipes';
import { environment } from '@environments/environment';
import { AlertService, JitsiService } from '@app/services';
import { INotificationResp } from '@app/interfaces';
import { DatePipe, NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { CreateInteraction } from '../create-interaction/create-interaction';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    ModalComponent,
    NotImagePipe,
    DatePipe,
    CreateInteraction,
    NgClass,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './navbar.component.html',
  host: {
    class: 'w-full block',
  },
})
export class NavbarComponent {
  public storeService = inject(StoreService);
  _authService = inject(AuthService);
  _jitsiService = inject(JitsiService);
  _alertService = inject(AlertService);

  public user: User | undefined;
  public creations = signal<INotificationResp[]>([]);
  environment = environment;
  private notifySub?: Subscription;
  public isOpen: boolean = false;

  /**
   * Usuario actual, como signal.
   *
   * Antes se leía `localStorage.getItem('user')` aquí y en otros tres
   * componentes. Con el nuevo modelo de sesión `localStorage` **solo** guarda
   * el `refreshToken`, así que esas lecturas devolvían `null` y obligaban a
   * mantener el token de acceso persistido.
   */
  readonly currentUser = toSignal(this.storeService.user, {
    initialValue: undefined,
  });

  constructor() {
    /**
     * Los dropdowns de Flowbite (`user-dropdown`, `dropdownNotification`) viven
     * dentro de un `@if`, así que su markup **nace después** del
     * `initFlowbite()` de `AppComponent.ngOnInit`. Antes, el único momento en
     * que quedaban inicializados era tras un `location.reload()`.
     *
     * `afterRenderEffect` corre cuando el DOM ya está actualizado, que es
     * exactamente cuando hay que enlazar los dropdowns nuevos.
     */
    afterRenderEffect(() => {
      if (this.currentUser()) {
        initDropdowns();
      }
    });

    this.storeService.user.subscribe((user) => {
      this.user = user;
      if (user) {
        setTimeout(() => {
          this.notificationSrv();
          this._jitsiService.connectWebSocket();
        }, 1500);
      }
    });

    // Suscribirse a las notificaciones en tiempo real
    this.notifySub = this._jitsiService.notification$.subscribe(
      (notification) => {
        this._alertService.addAlert({
          title: notification.title || 'Nueva notificación',
          message: notification.message || '',
          type: 'info',
        });
        this.creations.update((creations) => [
          notification,
          ...creations.filter(
            (n) => n.notificationId !== notification.notificationId,
          ),
        ]);
      },
    );
  }
  openModal() {
    if (!this.user) this.storeService.isLoginSubject.next(true);
  }
  closeModal() {
    this.storeService.isLoginSubject.next(false);
  }

  closeModalCreation() {
    this.isOpen = false;
  }
  requestDemo() {
    const url = `${environment.REQUEST_DEMO_URL}`;
    window.open(url, '_blank');
  }

  notificationSrv() {
    this._jitsiService.getNotificacionWS().subscribe({
      next: (notifications) => {
        this.creations.set(notifications || []);
      },
      error: (err) => {
        console.error('Error al obtener notificaciones no leídas:', err);
      },
    });
  }

  goToRoom(notification: INotificationResp) {
    this._jitsiService.createJitsi(notification.content.videoRoomUrl);
  }

  changeStatusRoom(notification: INotificationResp) {
    if (notification.notificationId) {
      this._jitsiService
        .putMarkNotificationAsRead(notification.notificationId)
        .subscribe({
          next: () => {
            this.creations.update((list) =>
              list.filter(
                (n) => n.notificationId !== notification.notificationId,
              ),
            );
          },
          error: (err) =>
            console.error('Error al marcar notificación como leída:', err),
        });
    }
  }

  markAsRead(notification: INotificationResp, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (notification.notificationId) {
      this._jitsiService
        .putMarkNotificationAsRead(notification.notificationId)
        .subscribe({
          next: () => {
            this.creations.update((list) =>
              list.filter(
                (n) => n.notificationId !== notification.notificationId,
              ),
            );
          },
          error: (err) =>
            console.error('Error al marcar notificación como leída:', err),
        });
    }
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
  ngOnDestroy(): void {
    this.notifySub?.unsubscribe();
    this._jitsiService.disconnectWebSocket();
  }
}
