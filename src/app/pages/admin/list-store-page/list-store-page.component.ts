import { Component } from '@angular/core';

@Component({
  selector: 'tyn-list-store-page',
  imports: [],
  templateUrl: './list-store-page.component.html',
})
export default class ListStorePageComponent {
  isReportStore = [
    {
      id: 1111,
      title: 'Total tiendas',
      describe: 'Tiendas virtuales asociados a plataforma tynbiz',
      cant: 10000,
    },
    {
      id: 1112,
      title: 'Tiendas activas',
      describe:
        'Tiendas virtuales activas que estan con un plan en la plataforma tynbiz',
      cant: 8000,
    },
    {
      id: 1113,
      title: 'Tiendas Suspendidos',
      describe:
        'Tiendas virtuales suspendidos por falta de pago de un plan en la plat. tynbiz',
      cant: 1500,
    },
  ];
}
