import { BodyOptions, Box } from 'detect-collisions';
import { Subject } from 'rxjs/internal/Subject';

import { GameObject } from './game-object';
import { Lifecycle, LifecycleParent, LifecycleProps } from './lifecycle';

export class BoxBody extends Box implements LifecycleProps {
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
   * Parent GameObject is assigned at creation.
   */
  gameObject: LifecycleParent;

  /**
   * Each Lifecycle Object has label for pixi debugging.
   */
  label = 'BoxBody';

  constructor(
    gameObject: GameObject,
    width: number,
    height: number = width,
    options?: BodyOptions
  ) {
    super(gameObject, width, height, options);

    if (!width || !height) {
      throw new Error("BoxBody width or height can't be 0!");
    }

    gameObject.addChild(this);
  }

  /**
   * @param deltaTime = 1.0 for 60FPS
   */
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
