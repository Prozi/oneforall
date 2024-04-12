import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { Lifecycle, LifecycleProps } from './lifecycle';

export class Component implements LifecycleProps {
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
  label = 'Component';

  constructor(gameObject: GameObject) {
    this.gameObject = gameObject;
    this.gameObject.addComponent(this);
  }

  update(deltaTime: number): void {
    Lifecycle.update(this, deltaTime);
  }

  destroy(): void {
    Lifecycle.destroy(this);
  }
}
