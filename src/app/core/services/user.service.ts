import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(ApiService);

  /** GET /users */
  getAll(): Observable<User[]> {
    return this.api.get<User[]>('users');
  }

  /** GET /users/:id */
  getById(id: number): Observable<User> {
    return this.api.get<User>(`users/${id}`);
  }
}
