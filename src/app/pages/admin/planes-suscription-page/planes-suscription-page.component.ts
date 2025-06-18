import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { plan } from '@app/mock/plan.mock';

@Component({
  selector: 'tyn-planes-suscription-page',
  imports: [CommonModule],
  templateUrl: './planes-suscription-page.component.html',
})
export default class PlanesSuscriptionPageComponent {
  planList = plan;
}
