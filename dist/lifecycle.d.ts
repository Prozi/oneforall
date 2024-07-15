import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { GameObject, GameObjectParent } from './game-object';
import { Scene } from './scene';
import { SceneSSR } from './scene-ssr';
export type LifecycleParent = GameObject | SceneSSR | Scene | PIXI.Container;
export type LifecycleChild = GameObject | PIXI.Container;
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
   * Updates the Lifecycle with actual deltaTime = 1.0 for 60FPS
   */
  update(deltaTime: number): void;
  /**
   * Called to destroy can cleanup Lifecycle Object.
   */
  destroy(): void;
}
export declare abstract class Lifecycle implements LifecycleProps {
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
   */
  gameObject?: GameObjectParent;
  /**
   * Lifecycles can have children Lifecycles
   */
  children: LifecycleProps[];
  /**
   * Each Lifecycle Object has label for pixi debugging.
   */
  label: string;
  static destroy(lifecycle: LifecycleProps): void;
  static update(lifecycle: LifecycleProps, deltaTime: number): void;
  destroy(): void;
  /**
   * Updates the Lifecycle with actual deltaTime = 1.0 for 60FPS
   */
  update(deltaTime: number): void;
}
//# sourceMappingURL=lifecycle.d.ts.map
