import { GameObject } from './game-object'
import { IComponent, Lifecycle } from './lifecycle'

export class Component extends Lifecycle implements IComponent {
  readonly name: string = 'Component'
  readonly gameObject: GameObject

  constructor(gameObject: GameObject) {
    super()
    this.gameObject = gameObject
    this.gameObject.addComponent(this)
  }

  static destroy(component: Component): void {
    component.gameObject.removeComponent(component)

    Lifecycle.destroy(component)
  }

  static update(component: Component): void {
    Lifecycle.update(component)
  }

  destroy(): void {
    Component.destroy(this)
  }
}
