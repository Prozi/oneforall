import { Subject } from 'rxjs'
import { Oval } from 'detect-collisions'
import { GameObject } from './game-object'
import { IComponent, Lifecycle } from './lifecycle'

export class CircleBody extends Oval implements IComponent {
  readonly name: string = 'CircleBody'
  readonly gameObject: GameObject
  readonly update$: Subject<void> = new Subject()
  readonly destroy$: Subject<void> = new Subject()

  constructor(
    gameObject: GameObject,
    radiusX: number,
    radiusY: number = radiusX,
    step = 10
  ) {
    super(gameObject, radiusX, radiusY, step)

    if (!radiusX || !radiusY) {
      throw new Error("CircleBody radius[X|Y] can't be 0!")
    }

    this.gameObject = gameObject
    this.gameObject.addComponent(this)
  }

  update(): void {
    this.gameObject.x = this.x
    this.gameObject.y = this.y

    Lifecycle.update(this)
  }

  destroy(): void {
    Lifecycle.destroy(this)
  }
}
