import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Album } from '../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AlbumService {
  private readonly api = inject(ApiService);

  /** GET /albums */
  getAll(): Observable<Album[]> {
    return this.api.get<Album[]>('albums');
  }

  /** GET /albums/:id */
  getById(id: number): Observable<Album> {
    return this.api.get<Album>(`albums/${id}`);
  }

  /** GET /albums?userId=:userId */
  getByUserId(userId: number): Observable<Album[]> {
    return this.api.get<Album[]>('albums', { userId });
  }
}
