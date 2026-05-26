import { Component, inject, input } from '@angular/core';
import { FileDocumentsService } from '@app/services';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'tyn-pdfupload',
  imports: [PdfViewerModule],
  templateUrl: './pdfupload.html',
})
export class Pdfupload {
  private _fileDocSrv = inject(FileDocumentsService);

  pdfSrc = input('./assets/pdf/documento.pdf'); // Ruta local o URL
  typeDoc = input<'PRIVACY_POLICY' | 'TERMS_OF_SERVICE'>('PRIVACY_POLICY');
  pdfSrcView = true; // Ruta local o URL

  handleFileSelect = async (
    event: Event,
    type: 'PRIVACY_POLICY' | 'TERMS_OF_SERVICE',
  ) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && file.type === 'application/pdf') {
      this._fileDocSrv.postFileDocuments(file, type).subscribe({
        next: (data) => {
          console.log('data', data);
        },
        error: (error) => {
          console.log('error', error);
        },
      });
    } else {
      alert('Por favor selecciona un archivo PDF.');
      target.value = '';
    }
  };
}
