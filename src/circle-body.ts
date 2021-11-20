import { Subject } from 'rxjs'
import { Circle } from 'detect-collisions'
import { GameObject } from './game-object'
import { IComponent, Lifecycle } from '.'

export class CircleBody extends Circle implements IComponent {
  readonly name: string = 'CircleBody'
  readonly gameObject: GameObject
  readonly update$: Subject<void> = new Subject()
  readonly destroy$: Subject<void> = new Subject()

  constructor(gameObject: GameObject, radius: number) {
    super(gameObject, radius)

    if (!radius) {
      throw new Error("CircleBody radius can't be 0!")
    }

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
