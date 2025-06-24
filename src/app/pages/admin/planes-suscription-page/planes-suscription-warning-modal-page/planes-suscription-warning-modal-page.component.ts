import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tyn-planes-suscription-warning-modal-page',
  imports: [CommonModule],
  templateUrl: './planes-suscription-warning-modal-page.component.html',
})
export class PlanesSuscriptionWarningModalPageComponent {
  @Input() visible: boolean = false;
  @Input() itemName: string = '';
  @Input() actionLabel: string = 'Confirmar';
  @Input() actionType: 'eliminar' | 'activar' = 'activar';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();


  onConfirm() {
    this.confirm.emit();
  }
  onCancel() {
    this.cancel.emit();
  }
}
