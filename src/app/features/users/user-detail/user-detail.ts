import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Albums } from '../../albums/albums';

@Component({
  selector: 'app-user-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Albums],
  template: `
    <section class="user-detail">
      <p><a routerLink="/users">← Volver a usuarios</a></p>
      <app-albums [userId]="userId()" />
    </section>
  `,
})
export class UserDetail {
  private readonly route = inject(ActivatedRoute);

  /** Id del usuario tomado de la ruta. */
  readonly userId = toSignal(this.route.paramMap.pipe(map((params) => Number(params.get('id')))), {
    initialValue: Number(this.route.snapshot.paramMap.get('id')),
  });
}
