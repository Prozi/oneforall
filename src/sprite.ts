import * as PIXI from "pixi.js";
import { Subject } from "rxjs/internal/Subject";
import { Component } from "./component";
import { GameObject } from "./game-object";
import { Lifecycle, LifecycleProps } from "./lifecycle";
import { PIXIResource } from "./resources";

export class Sprite extends PIXI.Sprite implements LifecycleProps {
  readonly name: string = "Sprite";
  readonly gameObject: GameObject;
  readonly update$: Subject<void> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

  constructor(gameObject: GameObject, texture: PIXIResource) {
    super(texture);

    this.gameObject = gameObject;
    this.gameObject.addComponent(this);
  }

  update(): void {
    if (!this.parent) {
      this.gameObject.scene?.stage.addChild(this);
    }

    this.x = this.gameObject.x;
    this.y = this.gameObject.y;

    Component.prototype.update.call(this);
  }

  destroy(): void {
    Lifecycle.prototype.destroy.call(this);

    super.destroy();
  }
}
