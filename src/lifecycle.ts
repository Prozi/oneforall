import { Subject } from 'rxjs/internal/Subject';

import { GameObject } from './game-object';
import { Scene } from './scene';
import { SceneBase } from './scene-base';

export interface LifecycleProps {
  /**
   * When Lifecycle Object is updated, it emits this subject.
   * Along with updating his children, which in turn behave the same.
   */
  readonly update$: Subject<number>;

  /**
   * When Lifecycle Object is destroyed, it emits and closes this subject.
   * Along with destroying his children, which in turn behave the same.
   */
  readonly destroy$: Subject<void>;

  /**
   * Parent GameObject is assigned at creation.
   * BaseScene & Scene don't have parent gameObject
   */
  readonly gameObject?: GameObject;

  /**
   * Each Lifecycle Object has label for pixi debugging.
   */
  label: string;

  /**
   * Lifecycle Object may be added to a Scene Object.
   */
  scene?: SceneBase | Scene;

  /**
   * Updates the Lifecycle Object with actual deltaTime ~60fps
   */
  update(deltaTime: number): void;

  /**
   * Called to destroy can cleanup Lifecycle Object.
   */
  destroy(): void;
}

export abstract class Lifecycle implements LifecycleProps {
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
   * BaseScene & Scene don't have parent gameObject
   */
  readonly gameObject?: GameObject;

  /**
   * Each Lifecycle Object has label for pixi debugging.
   */
  label = 'Lifecycle';

  /**
   * Lifecycle Object may be added to a Scene Object.
   */
  scene?: SceneBase | Scene;

  static destroy(lifecycle: LifecycleProps): void {
    if (lifecycle.gameObject) {
      lifecycle.gameObject.removeChild(lifecycle);
    } else if (!(lifecycle instanceof GameObject)) {
      console.log({ gameObject: lifecycle.label });
    }
    if (lifecycle.update$) {
      lifecycle.update$.complete();
    } else {
      console.log({ update$: lifecycle.label });
    }
    if (lifecycle.destroy$) {
      lifecycle.destroy$.next();
      lifecycle.destroy$.complete();
    } else {
      console.log({ destroy$: lifecycle.label });
    }
  }

  static update(lifecycle: LifecycleProps, deltaTime: number): void {
    if (lifecycle.update$) {
      lifecycle.update$.next(deltaTime);
    } else {
      console.log({ update$: lifecycle.label });
    }
  }

  destroy(): void {
    Lifecycle.destroy(this);
  }

  update(deltaTime: number): void {
    Lifecycle.update(this, deltaTime);
  }
}
