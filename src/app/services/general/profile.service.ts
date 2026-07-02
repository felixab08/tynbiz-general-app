import { HttpClient } from '@angular/common/http';
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
    avatarBinary: any,
  ): Observable<IRespProfileAvatar> {
    return this._http.put<IRespProfileAvatar>(uploadUrl, avatarBinary);
  }

  putUpdateUserProfileAvatar(publicUrl: string): Observable<IProfile> {
    return this._http.put<IProfile>(`${baseUrl}/users/me/avatar`, {
      avatarUrl: publicUrl,
    });
  }
}
