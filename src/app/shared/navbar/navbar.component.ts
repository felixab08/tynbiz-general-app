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
import { creationStoreMock } from '@app/mock/creationsStore.mock';
import { NotImagePipe } from '@app/pipes';
import { environment } from '@environments/environment';
import { JitsiService } from '@app/services';
import { INotificationResp } from '@app/interfaces';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ModalComponent, LoginComponent, NotImagePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  public storeService = inject(StoreService);
  public isLogin: boolean = false;
  _authService = inject(AuthService);
  _jitsiService = inject(JitsiService);
  public user: User | undefined;
  public creations = signal<INotificationResp[]>([]);
  environment = environment;
  private notifySub?: Subscription;

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
        }, 500);
      }
    });

    // Suscribirse a las notificaciones en tiempo real
    this.notifySub = this._jitsiService.notification$.subscribe(
      (notification) => {
        console.log(
          'Nueva notificación recibida en NavbarComponent:',
          notification,
        );
        this.creations.update((creations) => [notification, ...creations.filter(n => n.notificationId !== notification.notificationId)]);
      },
    );
  }

  openModal() {
    this.storeService.isLoginSubject.next(true);
  }

  closeModal() {
    this.storeService.isLoginSubject.next(false);
  }

  requestDemo() {
    const url = `${environment.REQUEST_DEMO_URL}`;
    window.open(url, '_blank');
  }

  notificationSrv() {
    this._jitsiService.getNotificacionWS().subscribe({
      next: (notifications) => {
        console.log('Notificaciones no leídas obtenidas:', notifications);
        this.creations.set(notifications || []);
      },
      error: (err) => {
        console.error('Error al obtener notificaciones no leídas:', err);
      },
    });
  }

  goToRoom(notification: INotificationResp) {
    if (notification.notificationId) {
      this._jitsiService.markNotificationAsRead(notification.notificationId).subscribe({
        next: () => {
          this.creations.update((list) =>
            list.filter((n) => n.notificationId !== notification.notificationId),
          );
        },
        error: (err) => console.error('Error al marcar notificación como leída:', err),
      });
    }

    const videoUrl = notification.content?.videoRoomUrl;
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  }

  markAsRead(notification: INotificationResp, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (notification.notificationId) {
      this._jitsiService.markNotificationAsRead(notification.notificationId).subscribe({
        next: () => {
          this.creations.update((list) =>
            list.filter((n) => n.notificationId !== notification.notificationId),
          );
        },
        error: (err) => console.error('Error al marcar notificación como leída:', err),
      });
    }
  }

  ngOnDestroy(): void {
    this.notifySub?.unsubscribe();
    this._jitsiService.disconnectWebSocket();
  }
}
