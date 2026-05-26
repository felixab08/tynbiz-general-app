import { Component, inject, input } from '@angular/core';
import { AlertService, FileDocumentsService } from '@app/services';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'tyn-pdfupload',
  imports: [PdfViewerModule],
  templateUrl: './pdfupload.html',
})
export class Pdfupload {
  pdfSrc = input('./assets/pdf/documento.pdf'); // Ruta local o URL
  typeDoc = input<'PRIVACY_POLICY' | 'TERMS_OF_SERVICE'>('PRIVACY_POLICY');
  pdfSrcView = true; // Ruta local o URL
  titlePolitic = input<string>('');
  private _fileDocSrv = inject(FileDocumentsService);
  private _alert = inject(AlertService);

  handleFileSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && file.type === 'application/pdf') {
      this._fileDocSrv.postFileDocuments(file, this.typeDoc()).subscribe({
        next: (data) => {
          this._alert.getAlert(
            'Success',
            'Archivo subido correctamente',
            'success',
          );
        },
        error: (error) => {
          this._alert.getAlert(
            'Error!!!',
            error.error.detail || 'Error al subir el archivo',
            'error',
          );
        },
      });
    } else {
      this._alert.getAlert(
        'Error!!!',
        'Por favor selecciona un archivo PDF.',
        'error',
      );
      target.value = '';
    }
  };
}
