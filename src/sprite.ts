import * as PIXI from 'pixi.js'
import { Subject } from 'rxjs'
import { Component, IComponent } from './component'
import { GameObject } from './game-object'

export class Sprite extends PIXI.Sprite implements IComponent {
  readonly name: string = 'Sprite'
  readonly gameObject: GameObject
  readonly update$: Subject<void> = new Subject()
  readonly destroy$: Subject<void> = new Subject()

  constructor(gameObject: GameObject, texture: PIXI.Texture) {
    super(texture)

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
