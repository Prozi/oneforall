import { Subject } from 'rxjs'
import { GameObject } from './game-object'

export interface ILifecycle {
  readonly name: string
  readonly update$: Subject<void>
  readonly destroy$: Subject<void>

  update(): void
  destroy(): void
}

export interface IComponent extends ILifecycle {
  readonly gameObject: GameObject
}

export class Lifecycle implements ILifecycle {
  readonly name: string = 'Lifecycle'
  readonly update$: Subject<void> = new Subject()
  readonly destroy$: Subject<void> = new Subject()

  static destroy(lifecycle: ILifecycle): void {
    lifecycle.destroy$.next()
    lifecycle.destroy$.complete()
    lifecycle.update$.complete()
  }

  static update(lifecycle: ILifecycle): void {
    lifecycle.update$.next()
  }

  update(): void {
    Lifecycle.update(this)
  }

  destroy(): void {
    Lifecycle.destroy(this)
  }
}

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
