import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
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
    LoginComponent,
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
  public isLogin: boolean = false;
  _authService = inject(AuthService);
  _jitsiService = inject(JitsiService);
  _alertService = inject(AlertService);

  public user: User | undefined;
  public creations = signal<INotificationResp[]>([]);
  environment = environment;
  private notifySub?: Subscription;
  public isOpen: boolean = false;

  constructor() {
    let user = localStorage.getItem('user');
    if (user) this.storeService.user.next(JSON.parse(user));

    this.storeService.isLoginSubject.subscribe((isLoggedIn) => {
      this.isLogin = isLoggedIn;
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
    this.storeService.isLoginSubject.next(true);
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
