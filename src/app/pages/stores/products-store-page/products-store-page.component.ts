import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from '@environments/environment';

@Component({
  selector: 'tyn-products-store-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-store-page.component.html',
})
export default class ProductsStorePageComponent implements OnInit, OnDestroy {
  step = 1;
  shopDomain = '';
  installOpened = false;
  connectIsPending = false;
  connectIsError = false;
  appName = 'Mi App'; // ![TODO] reemplazar por valor real de configuración
  private sub?: Subscription;
  private route = inject(ActivatedRoute);
  stepOptions = [
    { value: 1, label: 'Conectar tienda' },
    { value: 2, label: 'Instalar aplicación' },
  ];

  listSteps = [
    'Haz clic en el botón para abrir Shopify',
    'Instala la app personalizada de ' + this.appName,
    'Vuelve aquí y continúa al paso 2',
  ];

  ngOnInit() {
    this.sub = this.route.queryParamMap.subscribe((params) => {
      if (params.get('step') === '2') {
        this.step = 2;
        this.installOpened = true;
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  handleOpenInstall() {
    window.open(
      environment.NEXT_PUBLIC_SHOPIFY_INSTALL_URL,
      '_blank',
      'noopener,noreferrer',
    );
    this.installOpened = true;
  }

  connect() {
    if (!this.shopDomain.includes('.myshopify.com')) return;
    this.connectIsPending = true;
    this.connectIsError = false;
    // TODO: reemplazar por llamada real a servicio
    setTimeout(() => {
      this.connectIsPending = false;
      const success = Math.random() > 0.3;
      if (!success) {
        this.connectIsError = true;
      } else {
        console.log('Shopify conectado:', this.shopDomain);
      }
    }, 1200);
  }
}
