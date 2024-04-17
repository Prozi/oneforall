import { BodyOptions, Polygon, Vector } from 'detect-collisions';
import { Subject } from 'rxjs/internal/Subject';

import { GameObject } from './game-object';
import { Lifecycle, LifecycleProps } from './lifecycle';

export class PolygonBody extends Polygon implements LifecycleProps {
  /**
   * Parent GameObject is assigned at creation.
   */
  readonly gameObject: GameObject;

  /**
   * When Lifecycle Object is updated, it emits this subject.
   * Along with updating his children, which in turn behave the same.
   */
  readonly update$: Subject<number> = new Subject();

  /**
   * When Lifecycle Object is destroyed, it emits and closes this subject.
   * Along with destroying his children, which in turn behave the same.
   */
  readonly destroy$: Subject<void> = new Subject();

  /**
   * Each Lifecycle Object has label for pixi debugging.
   */
  label = 'PolygonBody';

  constructor(gameObject: GameObject, points: Vector[], options?: BodyOptions) {
    super(gameObject, points, options);
    this.gameObject = gameObject;
    this.gameObject.addChild(this);
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
