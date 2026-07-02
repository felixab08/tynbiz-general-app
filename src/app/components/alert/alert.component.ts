import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { AlertI } from '@app/interfaces/alert.interface';
import { AlertService } from '@app/services';

@Component({
  selector: 'tyn-alert',
  imports: [NgClass],
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  alertMenu = input.required<AlertI>();
  _alertService = inject(AlertService);
}
