import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SelectedOption } from '@app/interfaces';
import { environment } from '@environments/environment.development';
import { Observable } from 'rxjs';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private _http = inject(HttpClient);

  getCategoryByStore(): Observable<SelectedOption[]> {
    return this._http.get<SelectedOption[]>(
      `${baseUrl}/options/store-categories`,
    );
  }
}
