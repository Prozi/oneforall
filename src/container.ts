import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';

import { GameObject } from './game-object';
import { Lifecycle, LifecycleProps } from './lifecycle';

export class Container extends PIXI.Container implements LifecycleProps {
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
