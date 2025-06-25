import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { paymentMethodsStats } from '@app/mock/paymentMethods.mock';


@Component({
  selector: 'tyn-payment-page',
  imports: [CommonModule],
  templateUrl: './payment-page.component.html',
})
export default class PaymentPageComponent {
  listMethods = paymentMethodsStats ;
}
