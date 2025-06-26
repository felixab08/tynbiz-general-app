import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'tyn-success-modal',
  imports: [CommonModule],
  templateUrl: './success-modal.component.html',
})
export class SuccessModalComponent {

  visible = input.required<boolean>();
  itemName = input.required<string>();
  actionType = input.required<string>();
  succesType = input.required<string>();

  close = output<void>();

  onClose() {
    this.close.emit();
  }

  get actionVerb() {
  switch (this.actionType()) {
    case 'eliminar': return 'eliminó';
    case 'activar': return 'activó';
    case 'desactivar': return 'desactivó';
    default: return 'realizó';
  }}
  get state() {
  switch (this.actionType()) {
    case 'activar': return 'activo';
    case 'desactivar': return 'inactivo';
    default: return 'none';
  }
}


}
