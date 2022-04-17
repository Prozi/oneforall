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
  key?: string
}

export class Lifecycle implements ILifecycle {
  readonly name: string = 'Lifecycle'
  readonly update$: Subject<void> = new Subject()
  readonly destroy$: Subject<void> = new Subject()

  static destroy(lifecycle: ILifecycle): void {
    lifecycle.destroy$.next()
    lifecycle.destroy$.complete()
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
