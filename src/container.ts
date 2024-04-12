import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';

import { GameObject } from './game-object';
import { Lifecycle, LifecycleProps } from './lifecycle';

export class Container extends PIXI.Container implements LifecycleProps {
  readonly gameObject: GameObject;
  readonly update$: Subject<number> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

  label = 'Container';

  constructor(gameObject: GameObject) {
    super();
    this.gameObject = gameObject;
    this.gameObject.addComponent(this);
  }

  update(deltaTime: number): void {
    this.x = this.gameObject.x;
    this.y = this.gameObject.y;

    Lifecycle.update(this, deltaTime);
  }

  destroy(): void {
    super.destroy();

    Lifecycle.destroy(this);
  }
}
