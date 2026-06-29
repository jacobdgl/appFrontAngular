import { Injectable, Signal, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../models';
import { ApiService } from './api.service';

/**
 * TodoService.
 *
 * Lecturas: GET reales contra jsonplaceholder.
 *
 * Escrituras: la API NO persiste POST/PUT/DELETE (son falsos). Por eso las
 * mutaciones se gestionan en ESTADO LOCAL del cliente (signal), sembrado con los
 * todos que devuelve `getByUserId`. Los ids creados en cliente son negativos y
 * decrecientes (-1, -2, ...) para no colisionar con los ids reales (positivos).
 */
@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly api = inject(ApiService);

  /** Estado local editable. Fuente de verdad para la UI tras sembrar. */
  private readonly _todos = signal<Todo[]>([]);
  readonly todos: Signal<readonly Todo[]> = this._todos.asReadonly();

  /** Siguiente id local (negativo, decreciente). */
  private nextLocalId = -1;

  // --- Lecturas (GET reales) ---

  /** GET /todos */
  getAll(): Observable<Todo[]> {
    return this.api.get<Todo[]>('todos');
  }

  /** GET /todos/:id */
  getById(id: number): Observable<Todo> {
    return this.api.get<Todo>(`todos/${id}`);
  }

  /** GET /todos?userId=:userId */
  getByUserId(userId: number): Observable<Todo[]> {
    return this.api.get<Todo[]>('todos', { userId });
  }

  // --- Estado local (sin persistencia remota) ---

  /** Siembra el estado local con los todos de la API y reinicia el contador. */
  setTodos(todos: readonly Todo[]): void {
    this._todos.set([...todos]);
    this.nextLocalId = -1;
  }

  /** Crea un todo en estado local con id de cliente. Lo añade al principio. */
  add(todo: Omit<Todo, 'id'>): Todo {
    const created: Todo = { ...todo, id: this.nextLocalId-- };
    this._todos.update((list) => [created, ...list]);
    return created;
  }

  /** Alterna `completed` en estado local. */
  toggleCompleted(id: number): void {
    this._todos.update((list) =>
      list.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }

  /** Actualiza campos de un todo en estado local. Devuelve el resultante. */
  update(id: number, changes: Partial<Omit<Todo, 'id'>>): Todo {
    let updated: Todo | undefined;
    this._todos.update((list) =>
      list.map((t) => {
        if (t.id !== id) {
          return t;
        }
        updated = { ...t, ...changes };
        return updated;
      }),
    );
    if (!updated) {
      throw new Error(`TodoService.update: no existe todo con id=${id}`);
    }
    return updated;
  }

  /** Elimina un todo del estado local. */
  remove(id: number): void {
    this._todos.update((list) => list.filter((t) => t.id !== id));
  }
}
