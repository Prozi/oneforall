import { BodyOptions, Polygon, Vector } from 'detect-collisions';
import { Subject } from 'rxjs/internal/Subject';

import { GameObject } from './game-object';
import { Lifecycle, LifecycleProps } from './lifecycle';

export class PolygonBody extends Polygon implements LifecycleProps {
  label = 'PolygonBody';
  readonly gameObject: GameObject;
  readonly update$: Subject<number> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

  constructor(gameObject: GameObject, points: Vector[], options?: BodyOptions) {
    super(gameObject, points, options);

    this.gameObject = gameObject;
    this.gameObject.addComponent(this);
  }

  update(deltaTime: number): void {
    this.gameObject.x = this.x;
    this.gameObject.y = this.y;

    Lifecycle.update(this, deltaTime);
  }

  destroy(): void {
    this.system?.remove(this);

    Lifecycle.destroy(this);
  }
}
