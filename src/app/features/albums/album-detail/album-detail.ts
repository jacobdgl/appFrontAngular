import { ChangeDetectionStrategy, Component, Signal, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Photo } from '../../../core/models';
import { PhotoService } from '../../../core/services';

/**
 * Detalle de un álbum: muestra sus fotos en un grid usando el thumbnailUrl.
 *
 * Lee `:id` de la ruta y carga `PhotoService.getByAlbumId`. Estado local con
 * loading/error como en las demás features.
 */
@Component({
  selector: 'app-album-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './album-detail.html',
  styleUrl: './album-detail.scss',
})
export class AlbumDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly photoService = inject(PhotoService);

  /** Id del álbum tomado de la ruta. */
  readonly albumId = toSignal(this.route.paramMap.pipe(map((params) => Number(params.get('id')))), {
    initialValue: Number(this.route.snapshot.paramMap.get('id')),
  });

  private readonly _photos = signal<readonly Photo[]>([]);
  readonly photos: Signal<readonly Photo[]> = this._photos.asReadonly();
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    // Carga las fotos del álbum; re-carga si cambia el id de la ruta.
    effect((onCleanup) => {
      const id = this.albumId();
      this.loading.set(true);
      this.error.set(false);

      const sub = this.photoService.getByAlbumId(id).subscribe({
        next: (list) => {
          this._photos.set(list);
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
