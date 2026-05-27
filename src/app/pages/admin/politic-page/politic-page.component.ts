import { Component, inject, input, signal } from '@angular/core';
import { AlertService, FileDocumentsService } from '@app/services';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Pdfupload } from '@app/components';
import { NgClass } from '@angular/common';
import { IFilesResp } from '@app/interfaces';

@Component({
  selector: 'tyn-politic-page',
  imports: [PdfViewerModule, Pdfupload, NgClass],
  templateUrl: './politic-page.component.html',
})
export default class PoliticPageComponent {
  private _fileDocSrv = inject(FileDocumentsService);
  private _alert = inject(AlertService);
  filesResp = signal<IFilesResp[] | null>(null);
  pdfSrc = './assets/pdf/documento.pdf'; // Ruta local o URL
  pdfSrcView = true; // Ruta local o URL
  selectedTab: 'Términos de servicio' | 'Políticas de privacidad' =
    'Políticas de privacidad';
  constructor() {
    this.getFileDocuments();
  }

  getFileDocuments() {
    this._fileDocSrv.getFileDocuments().subscribe({
      next: (data) => {
        this.filesResp.set(data);
        console.log(this.filesResp());
        this._alert.getAlert(
          'Success',
          'Políticas obtenidas correctamente',
          'success',
        );
      },
      error: (error) => {
        this._alert.getAlert(
          'Error!!!',
          error.error.detail || 'Error al obtener las políticas',
          'error',
        );
      },
    });
  }
}
