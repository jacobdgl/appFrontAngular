import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Photo } from '../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private readonly api = inject(ApiService);

  /** GET /photos?albumId=:albumId — fotos de UN álbum (no el catálogo completo). */
  getByAlbumId(albumId: number): Observable<Photo[]> {
    return this.api.get<Photo[]>('photos', { albumId });
  }

  /**
   * Miniatura de portada: pide SOLO la primera foto del álbum vía _limit=1.
   * NUNCA carga /photos completo (son 5000).
   */
  getAlbumCover(albumId: number): Observable<Photo | undefined> {
    return this.api.get<Photo[]>('photos', { albumId, _limit: 1 }).pipe(map((photos) => photos[0]));
  }
}
