import { Polygon } from 'detect-collisions'
import { AutoInject } from '@jacekpietal/dependency-injection'
import { Physics } from './physics'
import { Component } from './component'
import { GameObject } from './game-object'

export class CircleBody extends Component {
  readonly name: string = 'CircleBody'
  readonly polygon: Polygon
  readonly radius: number

  @AutoInject(Physics) physics: Physics

  constructor(gameObject: GameObject, radius: number) {
    super(gameObject)

    this.radius = radius
    this.polygon = this.physics.createCircle(
      this.gameObject.x,
      this.gameObject.y,
      this.radius
    )
  }

  get x(): number {
    return this.polygon.x
  }

  set x(x: number) {
    this.polygon.x = x
  }

  get y(): number {
    return this.polygon.y
  }

  set y(y: number) {
    this.polygon.y = y
  }

  update(): void {
    this.gameObject.x = this.polygon.x
    this.gameObject.y = this.polygon.y

    super.update()
  }

  destroy(): void {
    this.physics.remove(this.polygon)

    super.destroy()
  }
}
