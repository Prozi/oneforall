import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';

import { GameObject } from './game-object';
import { Lifecycle, LifecycleProps } from './lifecycle';
import { PIXIResource } from './resources';

export class Sprite extends PIXI.Sprite implements LifecycleProps {
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
  label = 'Sprite';

  constructor(gameObject: GameObject, texture: PIXIResource) {
    super(texture);

    this.gameObject = gameObject;
    this.gameObject.addComponent(this);

    // found no other way to truly override PIXI.Sprite destroy and trigger Lifecycle
    this.destroy = (): void => {
      super.destroy({ texture: false, textureSource: false });

      Lifecycle.destroy(this);
    };
  }

  update(deltaTime: number): void {
    this.x = this.gameObject.x;
    this.y = this.gameObject.y;

    Lifecycle.update(this, deltaTime);
  }
}
