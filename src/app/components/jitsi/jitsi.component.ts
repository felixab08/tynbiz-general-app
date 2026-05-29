import {
  Component,
  inject,
  input,
  signal,
  ElementRef,
  viewChild,
  effect,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { IErrorGeneralResp, IJitsiResp } from '@app/interfaces';
import { AlertService, JitsiService } from '@app/services';
import { environment } from '@environments/environment';

@Component({
  selector: 'tyn-jitsi-component',
  imports: [],
  templateUrl: './jitsi.component.html',
  styles: [
    `
      .jitsi-container {
        width: 100%;
        height: 1000px;
        min-height: 600px;
        border: 0;
      }
    `,
  ],
})
export class JitsiComponent implements OnInit, OnDestroy {
  private _jitsiSrv = inject(JitsiService);
  private _alertSrv = inject(AlertService);

  idContenido = input.required<number>();
  tokenJitsi = signal<IJitsiResp | null>(null);

  jitsiContainer = viewChild<ElementRef>('jitsiContainer');
  private api: any;

  constructor() {
    effect(() => {
      const container = this.jitsiContainer();
      const token = this.tokenJitsi();
      if (container && token) {
        this.initializeJitsi(token, container);
      }
    });
  }

  ngOnInit() {
    this.getJitsiToken();
  }

  getJitsiToken() {
    this._jitsiSrv.getJitsiStatus(this.idContenido()).subscribe({
      next: (response) => {
        console.log(response);
        this.tokenJitsi.set(response);
      },
      error: (error: IErrorGeneralResp) => {
        this._alertSrv.getAlert(
          'Error!!!',
          error.error.detail || 'Error en obtener la sala de Jitsi',
          'error',
        );
      },
    });
  }

  private loadJitsiScript(roomName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).JitsiMeetExternalAPI) {
        resolve();
        return;
      }

      const scriptId = 'jitsi-meet-external-api-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement;

      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `${environment.JITSI_URL}/${roomName}/external_api.js`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      } else {
        script.addEventListener('load', () => resolve());
        script.addEventListener('error', (err) => reject(err));
      }
    });
  }

  private async initializeJitsi(data: IJitsiResp, container: ElementRef) {
    if (this.api) {
      this.api.dispose();
    }

    try {
      await this.loadJitsiScript(data.roomName);

      const domain = environment.JITSI_URL.replace(/^https?:\/\//, '');
      const options = {
        roomName: data.roomName,
        parentNode: container.nativeElement,
        jwt: data.token,
        width: '100%',
        height: '100%',
      };

      this.api = new (window as any).JitsiMeetExternalAPI(domain, options);
    } catch (error) {
      console.error('Error al inicializar Jitsi Meet:', error);
      this._alertSrv.getAlert(
        'Error!!!',
        'No se pudo cargar el script de Jitsi Meet',
        'error',
      );
    }
  }

  ngOnDestroy() {
    if (this.api) {
      this.api.dispose();
    }
  }
}
