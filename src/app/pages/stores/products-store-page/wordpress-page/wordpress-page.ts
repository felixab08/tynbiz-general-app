import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconnectWordpress } from '@app/interfaces';
import { WordpressService } from '@app/services/stores/wordpress.service';

@Component({
  selector: 'tyn-wordpress-page',
  imports: [FormsModule],
  templateUrl: './wordpress-page.html',
})
export class WordpressPage {
  siteUrl = '';
  connectIsPending = false;
  connectIsError = false;
  _wordpressService = inject(WordpressService);
  private _checkIntervalId?: number;

  private validateUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  connectWordpress(): void {
    this.connectIsError = false;
    if (!this.validateUrl(this.siteUrl)) {
      this.connectIsError = true;
      return;
    }
    this.connectIsPending = true;
    // Simular conexión asíncrona; reemplazar con servicio real si aplica
    this._wordpressService.postIntegrationWordpress(this.siteUrl).subscribe({
      next: (data: IconnectWordpress) => {
        this.handleSuccessfulConnection(data);
      },
      error: () => {
        this.connectIsPending = false;
        this.connectIsError = true;
      },
    });
  }
  handleSuccessfulConnection(data: IconnectWordpress): void {
    this.connectIsPending = false;
    this.connectIsError = false;
    // Abrir el sitio en una pestaña nueva como confirmación mínima
    try {
      console.log('authorizationUrl:', data.authorizationUrl);
      const url = data.authorizationUrl ?? '';
      if (!url.startsWith('https://')) {
        alert('Callback inseguro: la URL de autorización debe usar HTTPS. Para desarrollo usa ngrok u otro túnel TLS.');
        return;
      }
      const newWin = window.open(url, '_blank');
      if (newWin) {
        try {
          // Evitar que la nueva ventana tenga acceso al opener
          (newWin as any).opener = null;
        } catch (e) {
          /* no-op */
        }
      }
      this.handleCheckingConnectionStatus();
    } catch (e) {
      // no-op
    }
  }

  handleCheckingConnectionStatus(): void {
    // Aquí se podría implementar lógica para verificar el estado de la conexión
    // por ejemplo, mediante polling o WebSocket, dependiendo de cómo funcione la integración real.
    // Evitar crear múltiples intervalos
    if (this._checkIntervalId) {
      clearInterval(this._checkIntervalId);
      this._checkIntervalId = undefined;
    }

    this._checkIntervalId = window.setInterval(() => {
      const sub = this._wordpressService.getWordpressStatus().subscribe({
        next: (res) => {
          if (res.status === 'ACTIVE') {
            // Mostrar mensaje y cancelar el polling
            alert('Conexión exitosa con WordPress!');
            if (this._checkIntervalId) {
              clearInterval(this._checkIntervalId);
              this._checkIntervalId = undefined;
            }
            try {
              sub.unsubscribe();
            } catch (e) {
              /* no-op */
            }
            // Aquí se podría redirigir a la página de productos
            // this.router.navigate(['/stores/products']);
          }
        },
        error: () => {
          try {
            sub.unsubscribe();
          } catch (e) {
            /* no-op */
          }
        },
      });
    }, 1500);
  }

  cancel(): void {
    // Reset simple; si se desea navegación real, reemplazar por Router
    this.siteUrl = '';
    this.connectIsError = false;
    this.connectIsPending = false;
    if (this._checkIntervalId) {
      clearInterval(this._checkIntervalId);
      this._checkIntervalId = undefined;
    }
    try {
      window.history.back();
    } catch (e) {
      // no-op
    }
  }
}
