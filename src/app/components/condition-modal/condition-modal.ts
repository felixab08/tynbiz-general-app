import {
  Component,
  effect,
  inject,
  input,
  Input,
  output,
  Output,
  signal,
} from '@angular/core';
import { IGeneralPDF } from '@app/interfaces';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AlertService, FileDocumentsService } from '@app/services';
import { ModalComponent } from '@app/shared/modal/modal.component';

@Component({
  selector: 'tyn-condition-modal',
  imports: [ModalComponent, PdfViewerModule],
  templateUrl: './condition-modal.html',
})
export class ConditionModal {
  typePolitic = input<'terminos_servicio' | 'politica_privacidad' | null>(null);
  @Input() isOpen = true;
  onOpen = output<boolean>();
  codePolitic = 0;
  private _fileDocSrv = inject(FileDocumentsService);
  private _alertService = inject(AlertService);

  filesResp = signal<IGeneralPDF[] | null>(null);

  constructor() {
    effect(() => {
      if (this.typePolitic()) {
        this.codePolitic = this.typePolitic() === 'terminos_servicio' ? 0 : 1;
      }
    });
    this.getFileDocumentsByClient();
  }

  getFileDocumentsByClient() {
    this._fileDocSrv.getFileDocumentsByClient().subscribe({
      next: (data) => {
        this.filesResp.set(data);
      },
      error: (error) => {
        this._alertService.getAlert(
          'Error!!!',
          error.error.detail || 'Error al obtener los documentos',
          'error',
        );
      },
    });
  }
  closeModal() {
    this.isOpen = false;
    this.onOpen.emit(this.isOpen);
  }
}
