import { Polygon } from 'detect-collisions'
import { AutoInject } from '@jacekpietal/dependency-injection'
import { Physics } from './physics'
import { Component } from './component'
import { GameObject } from './game-object'

export class PolygonBody extends Component {
  readonly name: string = 'PolygonBody'
  readonly polygon: Polygon

  @AutoInject(Physics) physics: Physics

  constructor(gameObject: GameObject, points: number[][]) {
    super(gameObject)

    this.polygon = this.physics.createPolygon(
      this.gameObject.x,
      this.gameObject.y,
      points
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
