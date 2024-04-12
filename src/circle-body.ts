import { BodyOptions, Ellipse } from 'detect-collisions';
import { Subject } from 'rxjs/internal/Subject';

import { GameObject } from './game-object';
import { Lifecycle, LifecycleProps } from './lifecycle';

export class CircleBody extends Ellipse implements LifecycleProps {
  readonly gameObject: GameObject;
  readonly update$: Subject<number> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

  label = 'CircleBody';

  constructor(
    gameObject: GameObject,
    radiusX: number,
    radiusY: number = radiusX,
    step = 16,
    options?: BodyOptions
  ) {
    super(gameObject, radiusX, radiusY, step, options);

    if (!radiusX || !radiusY) {
      throw new Error("CircleBody radius can't be 0!");
    }

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
