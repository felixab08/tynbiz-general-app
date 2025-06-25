import { Component } from '@angular/core';
import { SimpleCardComponent } from '../../../components/simple-card/simple-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tyn-revenue-page',
  imports: [SimpleCardComponent, RouterLink],
  templateUrl: './revenue-page.component.html',
})
export default class RevenuePageComponent {
  isReportStore = [
    {
      id: 1111,
      title: 'Uso de tynbiz',
      describe: 'Tiendas pagando x  uso de tynbiz',
      cant: 120089796.99,
    },
    {
      id: 1112,
      title: 'Plan Mensual',
      describe: 'Tiendas pagando S/ 45',
      cant: 1215000.99,
    },
    {
      id: 1113,
      title: 'Plan Anual',
      describe: 'Tiendas pagando S/ 550',
      cant: 300,
    },
  ];
  isReportSubscription = [
    {
      id: 2111,
      title: 'Total',
      describe: `Esta ganancia total que se muestra es de los planes de suscripcion( mensual, anual y  uso de tynbiz) de las tiendas virtuales, una vez asociado a tynbiz.
         La ganancia es de pago de planes de uso de la plataformatynbiz, Haz clic en "ver ganancias", para ver en detalle.`,
      cant: 440000,
    },
  ];
}
