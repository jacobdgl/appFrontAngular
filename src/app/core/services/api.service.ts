import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/** Query params admitidos por jsonplaceholder (incluye filtros tipo _limit). */
export type QueryParams = Record<string, string | number | boolean>;

/**
 * Servicio base HTTP. Centraliza la baseUrl y envuelve HttpClient.
 * Los servicios de dominio (User/Album/Photo/Todo) delegan aquí.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  /** GET tipado contra `${baseUrl}/${path}` con query params opcionales. */
  get<T>(path: string, params?: QueryParams): Observable<T> {
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    return this.http.get<T>(`${this.baseUrl}/${path}`, { params: httpParams });
  }
}
