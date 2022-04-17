import * as PIXI from 'pixi.js'
import { Subject } from 'rxjs'
import { Component } from './component'
import { GameObject } from './game-object'
import { IComponent } from './lifecycle'

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
    if (!this.parent) {
      this.gameObject.parent?.stage.addChild(this)
    }

    this.x = this.gameObject.x
    this.y = this.gameObject.y

    Component.update(this)
  }

  destroy(): void {
    this.gameObject.parent?.stage.removeChild(this)

    super.destroy()

    Component.destroy(this)
  }
}
