import { Subject } from 'rxjs'
import { GameObject } from './game-object'

export interface IComponent {
  readonly name: string
  readonly gameObject: GameObject
  readonly update$: Subject<void>
  readonly destroy$: Subject<void>

  update(): void
  destroy(): void
}

export class Component implements IComponent {
  readonly name: string = 'Component'
  readonly gameObject: GameObject
  readonly update$: Subject<void> = new Subject()
  readonly destroy$: Subject<void> = new Subject()

  constructor(gameObject: GameObject) {
    this.gameObject = gameObject
    this.gameObject.addComponent(this)
  }

  static destroy(component: Component): void {
    component.gameObject.removeComponent(component)
    component.destroy$.next()
    component.destroy$.complete()
    component.update$.complete()
  }

  static update(component: Component): void {
    component.update$.next()
  }

  update(): void {
    Component.update(this)
  }

  destroy(): void {
    Component.destroy(this)
  }
}
