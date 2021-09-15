import { Subject } from 'rxjs'
import { IComponent, ILifecycle, Lifecycle } from './component'
import { Prefab } from './prefab'
import { Scene } from './scene'

export class GameObject implements ILifecycle {
  readonly update$: Subject<void> = new Subject()
  readonly destroy$: Subject<void> = new Subject()
  readonly components: Set<IComponent> = new Set()
  readonly components$: Subject<void> = new Subject()

  parent: Scene
  name: string
  x: number
  y: number

  constructor(name: string = 'GameObject', x: number = 0, y: number = 0) {
    this.name = name
    this.x = x
    this.y = y
  }

  static async instantiate(prefab: Prefab): Promise<GameObject> {
    return await prefab.instantiate()
  }

  update(): void {
    Array.from(this.components.values()).forEach((component: IComponent) =>
      component.update()
    )

    Lifecycle.update(this)
  }

  destroy(): void {
    Array.from(this.components.values()).forEach((component: IComponent) =>
      component.destroy()
    )

    Lifecycle.destroy(this)
  }

  addComponent(component: IComponent, key: string = ''): IComponent {
    if (this.components.has(component)) {
      return
    }

    this.components.add(component)
    this.components$.next()

    if (key) {
      this[key] = component
    }

    return component
  }

  removeComponent(component: IComponent, key: string = ''): void {
    if (!this.components.has(component)) {
      return
    }

    if (key && this[key]) {
      this[key] = null
    }

    this.components.delete(component)
    this.components$.next()
  }

  getComponentOfType(type: string): IComponent {
    return Array.from(this.components.values()).find(
      ({ name }) => name === type
    )
  }

  getComponentsOfType(type: string): IComponent[] {
    return Array.from(this.components.values()).filter(
      ({ name }) => name === type
    )
  }
}
