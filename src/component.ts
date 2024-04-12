import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { Lifecycle, LifecycleProps } from './lifecycle';

export class Component implements LifecycleProps {
  readonly gameObject: GameObject;
  readonly update$: Subject<void> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

  label = 'Component';

  constructor(gameObject: GameObject) {
    this.gameObject = gameObject;
    this.gameObject.addComponent(this);
  }

  update(): void {
    Lifecycle.update(this);
  }

  destroy(): void {
    Lifecycle.destroy(this);
  }
}
