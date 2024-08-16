import * as PIXI from 'pixi.js';
import { LifecycleParent, LifecycleProps } from './lifecycle';
import { GameObject } from './game-object';
import { Subject } from 'rxjs/internal/Subject';
export declare class Sprite extends PIXI.Sprite implements LifecycleProps {
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
  gameObject: LifecycleParent;
  /**
   * Each Lifecycle Object has label for pixi debugging.
   */
  label: string;
  constructor(gameObject: GameObject, texture: PIXI.Texture);
  /**
   * @param deltaTime = 1.0 for 60FPS
   */
  update(deltaTime: number): void;
  destroy(): void;
}
//# sourceMappingURL=sprite.d.ts.map
