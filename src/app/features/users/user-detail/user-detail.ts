import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>User detail — :id (placeholder)</p>`,
})
export class UserDetail {}
