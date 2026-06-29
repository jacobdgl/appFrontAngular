import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Home — recién visitados (placeholder)</p>`,
})
export class Home {}
