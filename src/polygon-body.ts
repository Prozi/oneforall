import { Subject } from 'rxjs'
import { Polygon } from 'detect-collisions'
import { GameObject } from './game-object'
import { IComponent, Lifecycle } from '.'

export class PolygonBody extends Polygon implements IComponent {
  readonly name: string = 'PolygonBody'
  readonly gameObject: GameObject
  readonly update$: Subject<void> = new Subject()
  readonly destroy$: Subject<void> = new Subject()

  constructor(gameObject: GameObject, points: number[][]) {
    super(
      gameObject,
      points.map(([x, y]) => ({ x, y }))
    )

    this.gameObject = gameObject
    this.gameObject.addComponent(this)
  }

  get x(): number {
    return (this as any).pos.x
  }

  set x(x: number) {
    ;(this as any).pos.x = x
  }

  get y(): number {
    return (this as any).pos.y
  }

  set y(y: number) {
    ;(this as any).pos.y = y
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
