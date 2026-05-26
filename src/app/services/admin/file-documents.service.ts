import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IFilesResp } from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable, of, tap } from 'rxjs';
const baseUrl = environment.baseUrl;

type typeFile = 'PRIVACY_POLICY' | 'TERMS_OF_SERVICE';

@Injectable({
  providedIn: 'root',
})
export class FileDocumentsService {
  private _http = inject(HttpClient);

  postFileDocuments(file: File, type: typeFile) {
    const formData = new FormData();
    formData.append('file', file);
    return this._http.post(
      `${baseUrl}/admin/legal-documents/type/${type}/upload`,
      formData,
    );
  }
  getFileDocuments(): Observable<IFilesResp[]> {
    return this._http.get<IFilesResp[]>(`${baseUrl}/admin/legal-documents`);
  }
}
