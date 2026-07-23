import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUserStore } from '@app/auth/interfaces/user.interface';
import { IProfile, IProfileAvatar, IRespProfileAvatar } from '@app/interfaces';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _http = inject(HttpClient);

  getUserProfile(): Observable<IProfile> {
    return this._http.get<IProfile>(`${baseUrl}/users/me`);
  }

  getUserStoreProfile(): Observable<IUserStore> {
    return this._http.get<IUserStore>(`${baseUrl}/stores/me`);
  }

  patchUserProfile(profile: IProfile): Observable<IProfile> {
    return this._http.patch<IProfile>(`${baseUrl}/users/me`, profile);
  }
  patchUserStoreProfile(profile: IUserStore): Observable<IUserStore> {
    return this._http.patch<IUserStore>(`${baseUrl}/stores/me`, profile);
  }

  /**
   * Metodo para obtener la URL de carga prefirmada para el avatar del usuario.
   * @param avatar Objeto que contiene la información del avatar a cargar.
   * @returns Observable que emite la respuesta con la URL de carga prefirmada.
   */
  postUserProfileAvatar(
    avatar: IProfileAvatar,
  ): Observable<IRespProfileAvatar> {
    return this._http.post<IRespProfileAvatar>(
      `${baseUrl}/storage/presigned-url`,
      avatar,
    );
  }

  uploadImageToStorage(uploadUrl: string, file: File | Blob): Observable<any> {
    const contentType = (file as any)?.type || 'application/octet-stream';
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

  putUpdateStoreAvatar(publicUrl: string): Observable<IProfile> {
    return this._http.put<IProfile>(`${baseUrl}/stores/me/logo`, {
      logo: publicUrl,
    });
  }
}
