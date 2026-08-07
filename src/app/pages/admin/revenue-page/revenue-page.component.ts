import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SimpleCardComponent } from '../../../components/simple-card/simple-card.component';
import { RouterLink } from '@angular/router';
import { isReportStore, isReportSubscription } from '@app/mock/revenue.mock';

@Component({
  selector: 'tyn-revenue-page',
  imports: [SimpleCardComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './revenue-page.component.html',
})
export default class RevenuePageComponent {
  reportStore = isReportStore;
  reportSubscription = isReportSubscription;
}
