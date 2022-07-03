import { Subject } from "rxjs/internal/Subject";
import { BodyOptions, Ellipse } from "detect-collisions";
import { GameObject } from "./game-object";
import { IComponent } from "./lifecycle";
import { Component } from "./component";

export class CircleBody extends Ellipse implements IComponent {
  readonly name: string = "CircleBody";
  readonly gameObject: GameObject;
  readonly update$: Subject<void> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

  constructor(
    gameObject: GameObject,
    radiusX: number,
    radiusY: number = radiusX,
    step?: number,
    options?: BodyOptions
  ) {
    super(gameObject, radiusX, radiusY, step, options);

    if (!radiusX || !radiusY) {
      throw new Error("CircleBody radius can't be 0!");
    }

    this.gameObject = gameObject;
    this.gameObject.addComponent(this);
  }

  update(): void {
    this.gameObject.x = this.x;
    this.gameObject.y = this.y;

    Component.update(this);
  }

  destroy(): void {
    Component.destroy(this);
  }
}
