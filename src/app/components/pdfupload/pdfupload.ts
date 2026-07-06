import { Component, inject, input } from '@angular/core';
import { IFilesResp } from '@app/interfaces';
import { AlertService, FileDocumentsService } from '@app/services';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'tyn-pdfupload',
  imports: [PdfViewerModule],
  templateUrl: './pdfupload.html',
})
export class Pdfupload {
  pdfSrc = './assets/pdf/documento.pdf'; // Ruta local o URL
  filesResp = input<IFilesResp[] | null>(null);

  typeDoc = input<'PRIVACY_POLICY' | 'TERMS_OF_SERVICE'>('PRIVACY_POLICY');
  pdfSrcView = true; // Ruta local o URL
  titlePolitic = input<string>('');
  private _fileDocSrv = inject(FileDocumentsService);
  private _alert = inject(AlertService);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (
      this.filesResp() &&
      this.filesResp()!.length > 0 &&
      this.typeDoc() === 'TERMS_OF_SERVICE'
    ) {
      this.pdfSrc = this.filesResp()![1].currentVersion.publicUrl;
    } else if (
      this.filesResp() &&
      this.filesResp()!.length > 0 &&
      this.typeDoc() === 'PRIVACY_POLICY'
    ) {
      this.pdfSrc = this.filesResp()![0].currentVersion.publicUrl;
    }
  }

  handleFileSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    console.log(file);
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
          console.log(error);

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
