import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../models';
import { ApiService } from './api.service';

/**
 * TodoService.
 *
 * Lecturas: GET reales contra jsonplaceholder.
 *
 * Escrituras: la API NO persiste POST/PUT/DELETE (son falsos). Por eso las
 * mutaciones se gestionarán en ESTADO LOCAL del cliente (signals) en una fase
 * posterior. Aquí solo se declaran las firmas; sin lógica todavía (TODO).
 */
@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly api = inject(ApiService);

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

  // --- Mutaciones (estado local, sin persistencia remota) — TODO Fase posterior ---

  /** Crear todo en estado local. TODO: implementar con signals. */
  add(todo: Omit<Todo, 'id'>): Todo {
    throw new Error(`TODO: TodoService.add no implementado ("${todo.title}")`);
  }

  /** Alternar completed en estado local. TODO: implementar con signals. */
  toggleCompleted(id: number): void {
    throw new Error(`TODO: TodoService.toggleCompleted no implementado (id=${id})`);
  }

  /** Actualizar campos en estado local. TODO: implementar con signals. */
  update(id: number, changes: Partial<Omit<Todo, 'id'>>): Todo {
    throw new Error(
      `TODO: TodoService.update no implementado (id=${id}, keys=${Object.keys(changes).join(',')})`,
    );
  }

  /** Eliminar de estado local. TODO: implementar con signals. */
  remove(id: number): void {
    throw new Error(`TODO: TodoService.remove no implementado (id=${id})`);
  }
}
