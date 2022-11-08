import { Subject } from "rxjs/internal/Subject";
import { BodyOptions, Polygon, Vector } from "detect-collisions";
import { GameObject } from "./game-object";
import { ILifecycle, Lifecycle } from "./lifecycle";

export class PolygonBody extends Polygon implements ILifecycle {
  readonly name: string = "PolygonBody";
  readonly gameObject: GameObject;
  readonly update$: Subject<void> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

  constructor(gameObject: GameObject, points: Vector[], options?: BodyOptions) {
    super(gameObject, points, options);

    this.gameObject = gameObject;
    this.gameObject.addComponent(this);
  }

  update(): void {
    this.gameObject.x = this.x;
    this.gameObject.y = this.y;

    Lifecycle.prototype.update.call(this);
  }

  destroy(): void {
    Lifecycle.prototype.destroy.call(this);
  }
}
