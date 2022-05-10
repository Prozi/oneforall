import { Subject } from 'rxjs'
import { Polygon } from 'detect-collisions'
import { GameObject } from './game-object'
import { IComponent } from './lifecycle'
import { Component } from './component'

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

  update(): void {
    this.gameObject.x = this.x
    this.gameObject.y = this.y

    Component.update(this)
  }

  destroy(): void {
    Component.destroy(this)
  }
}
