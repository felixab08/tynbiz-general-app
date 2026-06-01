import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
  ICreateResq,
  ICreationResp,
  ICreationStoreRespo,
  OptionsRequest,
} from '@app/interfaces';
import { environment } from '@environments/environment.development';
import { Observable } from 'rxjs';
const baseUrl = environment.baseUrl;

const STORAGE_KEY = 'creation_creation';
const MAX = 5;
type TYPE_CREATION = 'ALL' | 'SHOWCASE' | 'NORMAL' | 'OFFER' | 'OFERTAS';
@Injectable({
  providedIn: 'root',
})
export class CreateCreation {
  private _http = inject(HttpClient);

  private _products = signal<any[]>(this.loadFromStorage());

  readonly products = computed(() => this._products());
  readonly count = computed(() => this._products().length);
  readonly isFull = computed(() => this.count() >= MAX);

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._products()));
    });
  }

  getCreationDiscovery(
    options: OptionsRequest,
    type: TYPE_CREATION = 'ALL',
  ): Observable<ICreationResp> {
    const {
      page = 0,
      size = 20,
      ubigeoId = '',
      keyword = '',
      storeCategory = '',
    } = options;
    // Construir params dinámicamente
    const params: any = {
      page,
      size,
    };
    if (ubigeoId.length > 0) params.ubigeoId = ubigeoId;
    if (keyword.length > 0) params.keyword = keyword;
    if (storeCategory !== '') params.storeCategory = storeCategory;    
    return this._http.get<ICreationResp>(
      `${baseUrl}/public/contents/discovery?type=${type}`,
      { params },
    );
  }

  getCreationStore(options: OptionsRequest): Observable<ICreationStoreRespo> {
    const { page = 0, size = 20, tab = '' } = options;
    // Construir params dinámicamente
    const params: any = {
      page,
      size,
    };
    if (tab.length > 0) params.tab = tab;
    return this._http.get<ICreationStoreRespo>(
      `${baseUrl}/contents/creations`,
      {
        params,
      },
    );
  }
  postRegisterCreations(creations: ICreateResq) {
    return this._http.post(`${baseUrl}/contents`, creations);
  }

  toggle(product: any) {
    const exists = this._products().some((p) => p.id === product.id);
    if (exists) {
      this._products.update((list) => list.filter((p) => p.id !== product.id));
      return;
    }
    if (this.isFull()) return;

    this._products.update((list) => [...list, product]);
  }

  isSelected(product: any): boolean {
    return this._products().some((p) => p.id === product.id);
  }

  clear() {
    this._products.set([]);
  }

  private loadFromStorage(): any[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}
