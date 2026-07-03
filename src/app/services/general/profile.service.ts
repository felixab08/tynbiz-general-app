import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IProfile, IProfileAvatar, IRespProfileAvatar } from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable, of, tap } from 'rxjs';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _http = inject(HttpClient);

  getUserProfile(): Observable<IProfile> {
    return this._http.get<IProfile>(`${baseUrl}/users/me`);
  }

  patchUserProfile(profile: IProfile): Observable<IProfile> {
    return this._http.patch<IProfile>(`${baseUrl}/users/me`, profile);
  }

  postUserProfileAvatar(
    avatar: IProfileAvatar,
  ): Observable<IRespProfileAvatar> {
    return this._http.post<IRespProfileAvatar>(
      `${baseUrl}/storage/presigned-url`,
      avatar,
    );
  }
  putUpdateImagenInCloudinary(
    uploadUrl: string,
    file: File | Blob,
  ): Observable<any> {
    let contentType = (file as any)?.type || 'application/octet-stream';
    if (contentType === 'image/jpg') contentType = 'image/jpeg';
    const headers = new HttpHeaders({ 'Content-Type': contentType });
    console.log(headers);

    return this._http.put(uploadUrl, file, {
      headers,
      responseType: 'text' as 'json',
    });
  }

  putUpdateUserProfileAvatar(publicUrl: string): Observable<IProfile> {
    return this._http.put<IProfile>(`${baseUrl}/users/me/avatar`, {
      avatarUrl: publicUrl,
    });
  }

  // const workerUrl = 'https://<tu-worker>.workers.dev/upload-proxy-worker'
  // const presigned = '<uploadUrl from backend>'
  // await fetch(`${workerUrl}?uploadUrl=${encodeURIComponent(presigned)}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': file.type },
  //   body: file
  // })
}
