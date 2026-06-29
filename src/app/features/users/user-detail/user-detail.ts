import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

import { User } from '../../../core/models';
import { UserService } from '../../../core/services';
import { Albums } from '../../albums/albums';

/** Estados explícitos de la carga del detalle. Unión discriminada. */
type DetailState =
  | { status: 'loading' }
  | { status: 'ok'; user: User }
  | { status: 'notfound' }
  | { status: 'error' };

@Component({
  selector: 'app-user-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Albums],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly users = inject(UserService);

  /** Stream del estado derivado del :id de la ruta. */
  private readonly state = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => {
        if (!Number.isInteger(id) || id <= 0) {
          return of<DetailState>({ status: 'notfound' });
        }
        return this.users.getById(id).pipe(
          map((user): DetailState => ({ status: 'ok', user })),
          startWith<DetailState>({ status: 'loading' }),
          catchError((err: HttpErrorResponse) =>
            of<DetailState>(err.status === 404 ? { status: 'notfound' } : { status: 'error' }),
          ),
        );
      }),
    ),
    { initialValue: { status: 'loading' } as DetailState },
  );

  protected readonly status = computed(() => this.state().status);
  protected readonly user = computed(() => {
    const s = this.state();
    return s.status === 'ok' ? s.user : null;
  });

  /** Website sin esquema → fuerza https:// para el href. */
  protected readonly websiteUrl = computed(() => {
    const site = this.user()?.website;
    if (!site) {
      return null;
    }
    return /^https?:\/\//i.test(site) ? site : `https://${site}`;
  });
}
