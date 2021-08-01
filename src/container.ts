import * as PIXI from 'pixi.js'
import { Subject } from 'rxjs'
import { Component, IComponent } from './component'
import { GameObject } from './game-object'

export class Container extends PIXI.Container implements IComponent {
  readonly name: string = 'Container'
  readonly gameObject: GameObject
  readonly update$: Subject<void> = new Subject()
  readonly destroy$: Subject<void> = new Subject()

  constructor(gameObject: GameObject) {
    super()

    this.gameObject = gameObject
    this.gameObject.addComponent(this)
  }

  update(): void {
    this.x = this.gameObject.x
    this.y = this.gameObject.y

    Component.update(this)
  }

  destroy(): void {
    super.destroy()

    Component.destroy(this)
  }
}
