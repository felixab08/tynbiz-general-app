import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  IJitsiResp,
  INotificationResp,
} from '@app/interfaces/stores/jitsi.interface';
import { environment } from '@environments/environment.development';
import { Observable, Subject } from 'rxjs';
import { Client, Frame, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { StoreService } from '../store.service';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class JitsiService {
  private _http = inject(HttpClient);
  private stompClient: Client | null = null;
  private notificationSubject = new Subject<INotificationResp>();

  public notification$ = this.notificationSubject.asObservable();
  private _storeService = inject(StoreService);
  refreshToken: string | null = null;

  constructor() {
    this._storeService.refreshTokenSubject.subscribe((refreshToken) => {
      this.refreshToken = refreshToken;
    });
  }

  getJitsiStatus(idContenido: number): Observable<IJitsiResp> {
    return this._http.get<IJitsiResp>(`${baseUrl}/jitsi/token/${idContenido}`);
  }

  getNotificacionWS(): Observable<INotificationResp[]> {
    return this._http.get<INotificationResp[]>(
      `${baseUrl}/notificacionWS/unread`,
    );
  }

  putMarkNotificationAsRead(id: number): Observable<boolean> {
    return this._http.put<boolean>(
      `${baseUrl}/notificacionWS/mark-read/${id}`,
      {},
    );
  }

  /**
   * Conecta con el servidor WebSocket/STOMP para recibir notificaciones en tiempo real.
   * Basado en la implementación de SockJS y STOMP.js.
   */
  connectWebSocket(customToken?: string): void {
    const token = customToken || localStorage.getItem('token');

    if (!token) {
      console.warn('WebSocket: No se encontró un token de autenticación.');
      return;
    }

    if (this.stompClient && this.stompClient.active) {
      console.log('WebSocket: La conexión ya se encuentra activa.');
      return;
    }

    // Obtener la raíz del host (removiendo /api/v1 si está presente)
    const rootUrl = baseUrl.replace(/\/api\/v1\/?$/, '');
    const wsUrl = `${rootUrl}/ws-notifications`;
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (msg: string) => {
        console.debug('[STOMP]:', msg);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = (frame: Frame) => {
      // Suscribirse a la cola privada de notificaciones
      this.stompClient?.subscribe(
        '/user/queue/notifications',
        (message: IMessage) => {
          try {
            const payload: INotificationResp = JSON.parse(message.body);
            this.notificationSubject.next(payload);
          } catch (error) {
            console.error('Error parsing notification message:', error);
          }
        },
      );
    };

    this.stompClient.onStompError = (frame: Frame) => {
      console.error('STOMP error:', frame);
    };

    this.stompClient.activate();
  }

  /**
   * Desconecta el cliente WebSocket/STOMP si se encuentra activo.
   */
  disconnectWebSocket(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      console.log('WebSocket desconectado.');
    }
  }
  createJitsi(videoRoomUrl: any) {
    const url = `${videoRoomUrl}` + `?code=${this.refreshToken}`;
    window.open(url, '_blank');
  }
}
