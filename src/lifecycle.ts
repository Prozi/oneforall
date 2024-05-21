import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';

import { GameObject } from './game-object';
import { Scene } from './scene';
import { SceneBase } from './scene-base';

export type LifecycleParent = GameObject | SceneBase | Scene | PIXI.Container;

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
   * BaseScene/Scene has no gameObject
   */
  gameObject?: LifecycleParent;

  /**
   * Each Lifecycle Object has label for pixi debugging.
   */
  label: string;

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
   * Each Lifecycle Object has label for pixi debugging.
   */
  label = 'Lifecycle';

  static destroy(lifecycle: LifecycleProps): void {
    // tslint:disable-next-line: no-any
    lifecycle.gameObject?.removeChild?.(lifecycle as any);
    lifecycle.update$.complete();
    lifecycle.destroy$.next();
    lifecycle.destroy$.complete();
  }

  static update(lifecycle: LifecycleProps, deltaTime: number): void {
    lifecycle.update$.next(deltaTime);
  }

  destroy(): void {
    Lifecycle.destroy(this);
  }

  update(deltaTime: number): void {
    Lifecycle.update(this, deltaTime);
  }
}
