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

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class JitsiService {
  private _http = inject(HttpClient);
  private stompClient: Client | null = null;
  private notificationSubject = new Subject<INotificationResp>();

  public notification$ = this.notificationSubject.asObservable();

  getJitsiStatus(idContenido: number): Observable<IJitsiResp> {
    return this._http.get<IJitsiResp>(`${baseUrl}/jitsi/token/${idContenido}`);
  }

  getNotificacionWS(): Observable<INotificationResp[]> {
    return this._http.get<INotificationResp[]>(
      `${baseUrl}/notificacionWS/unread`,
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
    console.log(token);
    const wsUrl = `${baseUrl}/ws-notifications`;
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: () => {
        // Deshabilitar logs de depuración (equivalente a stompClient.debug = null)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = (frame: Frame) => {
      console.log('Connected successfully!');
      if (frame.headers && frame.headers['user-name']) {
        console.log('connected as: ' + frame.headers['user-name']);
      }
      console.log('Connected: ', frame);

      // Suscribirse a la cola privada de notificaciones
      this.stompClient?.subscribe(
        '/user/queue/notifications',
        (message: IMessage) => {
          try {
            const payload: INotificationResp = JSON.parse(message.body);
            console.log('Received notification:', payload);
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
}

