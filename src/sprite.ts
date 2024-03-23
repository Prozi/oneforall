import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { Component } from './component';
import { GameObject } from './game-object';
import { Lifecycle, LifecycleProps } from './lifecycle';
import { PIXIResource } from './resources';

export class Sprite extends PIXI.Sprite implements LifecycleProps {
  label = 'Sprite';
  readonly gameObject: GameObject;
  readonly update$: Subject<void> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

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

  update(): void {
    if (!this.parent) {
      this.gameObject.scene?.addChild(this);
    }

    this.x = this.gameObject.x;
    this.y = this.gameObject.y;

    Component.update(this);
  }
}
