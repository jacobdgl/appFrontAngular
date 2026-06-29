import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { Album, Photo } from '../../core/models';
import { AlbumService, PhotoService } from '../../core/services';

/** Álbum con su foto de portada (o `undefined` si no tiene fotos). */
interface AlbumWithCover {
  readonly album: Album;
  readonly cover: Photo | undefined;
}

/**
 * Sección reutilizable de álbumes de un usuario.
 *
 * Recibe `userId` por input, carga sus álbumes (`getByUserId`) y la miniatura de
 * portada de cada uno (`getAlbumCover`, que puede no existir). Estado local con
 * loading/error siguiendo el patrón de las demás features.
 */
@Component({
  selector: 'app-albums',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './albums.html',
  styleUrl: './albums.scss',
})
export class Albums {
  private readonly albumService = inject(AlbumService);
  private readonly photoService = inject(PhotoService);

  /** Usuario cuyos álbumes se muestran. */
  readonly userId = input.required<number>();

  private readonly _albums = signal<readonly AlbumWithCover[]>([]);
  readonly albums: Signal<readonly AlbumWithCover[]> = this._albums.asReadonly();
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    // Carga álbumes + portadas; re-carga si cambia el usuario.
    effect((onCleanup) => {
      const id = this.userId();
      this.loading.set(true);
      this.error.set(false);

      const sub = this.albumService
        .getByUserId(id)
        .pipe(
          switchMap((albums) =>
            albums.length === 0
              ? of<AlbumWithCover[]>([])
              : forkJoin(
                  albums.map((album) =>
                    this.photoService
                      .getAlbumCover(album.id)
                      .pipe(map((cover) => ({ album, cover }))),
                  ),
                ),
          ),
        )
        .subscribe({
          next: (list) => {
            this._albums.set(list);
            this.loading.set(false);
          },
          error: () => {
            this.error.set(true);
            this.loading.set(false);
          },
        });

      onCleanup(() => sub.unsubscribe());
    });
  }
}
