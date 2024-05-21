import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';

import { GameObject } from './game-object';
import { Lifecycle, LifecycleParent, LifecycleProps } from './lifecycle';

export class Sprite extends PIXI.Sprite implements LifecycleProps {
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
  label = 'Sprite';

  constructor(gameObject: GameObject, texture: PIXI.Texture) {
    super(texture);
    gameObject.addChild(this);
  }

  update(deltaTime: number): void {
    this.x = this.gameObject.x;
    this.y = this.gameObject.y;
    Lifecycle.update(this, deltaTime);
  }

  destroy(): void {
    super.destroy({ texture: false, textureSource: false, children: true });
    Lifecycle.destroy(this);
  }
}
