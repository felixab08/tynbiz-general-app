import { Component } from '@angular/core';
import { storePlan } from '@app/mock/plan.mock';

@Component({
  selector: 'tyn-plan-suscrip-page',
  imports: [],
  templateUrl: './plan-suscrip-page.component.html',
})
export default class PlanSuscripPageComponent {
  planStoreList = storePlan;
}
