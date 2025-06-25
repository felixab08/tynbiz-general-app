import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';

@Component({
  selector: 'tyn-warning-modal',
  imports: [CommonModule],
  templateUrl: './warning-modal.component.html',
})
export class WarningModalComponent {

  visible = input.required<boolean>();
  itemName = input.required<string>();
  actionLabel = input('Confirmar');
  actionType = input<'eliminar' | 'activar' | 'desactivar'>('desactivar');

  confirm = output<void>();
  cancel = output<void>();

  onConfirm() {
    this.confirm.emit();
  }
  onCancel() {
    this.cancel.emit();
  }
}
