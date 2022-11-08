import * as PIXI from "pixi.js";
import { Subject } from "rxjs/internal/Subject";
import { Component } from "./component";
import { GameObject } from "./game-object";
import { ILifecycle } from "./lifecycle";

export class Container extends PIXI.Container implements ILifecycle {
  readonly name: string = "Container";
  readonly gameObject: GameObject;
  readonly update$: Subject<void> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

  constructor(gameObject: GameObject) {
    super();

    this.gameObject = gameObject;
    this.gameObject.addComponent(this);
  }

  update(): void {
    if (!this.parent) {
      this.gameObject.parent?.stage.addChild(this);
    }

    this.x = this.gameObject.x;
    this.y = this.gameObject.y;

    Component.prototype.update.call(this);
  }

  destroy(): void {
    this.gameObject.parent?.stage.removeChild(this);

    super.destroy();

    Component.prototype.destroy.call(this);
  }
}
