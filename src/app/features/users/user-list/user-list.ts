import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith } from 'rxjs';
import { User } from '../../../core/models';
import { UserService } from '../../../core/services';

/** Estado de carga del listado, modelado como unión discriminada. */
type UserListState =
  { status: 'loading' } | { status: 'error' } | { status: 'success'; users: User[] };

@Component({
  selector: 'app-user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  private readonly userService = inject(UserService);

  /** Stream HTTP convertido a signal: loading → success | error. */
  private readonly state = toSignal(
    this.userService.getAll().pipe(
      map((users): UserListState => ({ status: 'success', users })),
      startWith<UserListState>({ status: 'loading' }),
      catchError(() => of<UserListState>({ status: 'error' })),
    ),
    { initialValue: { status: 'loading' } satisfies UserListState },
  );

  protected readonly loading = computed(() => this.state().status === 'loading');
  protected readonly error = computed(() => this.state().status === 'error');
  protected readonly users = computed<User[]>(() => {
    const state = this.state();
    return state.status === 'success' ? state.users : [];
  });
}
