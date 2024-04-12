import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';

import { GameObject } from './game-object';
import { Lifecycle, LifecycleProps } from './lifecycle';
import { PIXIResource } from './resources';

export class Sprite extends PIXI.Sprite implements LifecycleProps {
  readonly gameObject: GameObject;
  readonly update$: Subject<number> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

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
