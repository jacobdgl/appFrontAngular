import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo } from '../../core/models';
import { TodoService } from '../../core/services';
import { noNumbersValidator } from '../../core/validators';

/**
 * Componente reutilizable de TODOs de un usuario.
 *
 * Recibe `userId` por input, siembra el estado local del `TodoService` con los
 * todos reales (GET) y opera sobre ese estado local: añadir, borrar y filtrar.
 */
@Component({
  selector: 'app-todos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './todos.html',
  styleUrl: './todos.scss',
})
export class Todos {
  private readonly todoService = inject(TodoService);
  private readonly fb = inject(FormBuilder);

  /** Usuario cuyos todos se gestionan. */
  readonly userId = input.required<number>();

  /** Estado local (fuente de verdad tras la siembra). */
  readonly todos: Signal<readonly Todo[]> = this.todoService.todos;

  /** Término del buscador reactivo. */
  readonly search = signal('');

  /** Lista filtrada en vivo sobre el estado local. */
  readonly filteredTodos = computed<readonly Todo[]>(() => {
    const term = this.search().trim().toLowerCase();
    const list = this.todos();
    if (term.length === 0) {
      return list;
    }
    return list.filter((t) => t.title.toLowerCase().includes(term));
  });

  /** Formulario de alta. Validación: requerido + sin números. */
  readonly addForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, noNumbersValidator]],
  });

  get titleControl() {
    return this.addForm.controls.title;
  }

  constructor() {
    // Siembra el estado local con los todos del usuario; re-siembra si cambia.
    effect((onCleanup) => {
      const id = this.userId();
      const sub = this.todoService
        .getByUserId(id)
        .subscribe((list) => this.todoService.setTodos(list));
      onCleanup(() => sub.unsubscribe());
    });
  }

  onSearch(value: string): void {
    this.search.set(value);
  }

  submit(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    const title = this.titleControl.value.trim();
    if (title.length === 0) {
      return;
    }
    this.todoService.add({ userId: this.userId(), title, completed: false });
    this.addForm.reset({ title: '' });
  }

  toggle(id: number): void {
    this.todoService.toggleCompleted(id);
  }

  remove(id: number): void {
    this.todoService.remove(id);
  }
}
