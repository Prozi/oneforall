import { Subject } from 'rxjs'
import { Scene } from '.'
import { IComponent, ILifecycle, Lifecycle } from './lifecycle'
import { Prefab } from './prefab'
import { SceneBase } from './scene-base'

export class GameObject implements ILifecycle {
  readonly update$: Subject<void> = new Subject()
  readonly destroy$: Subject<void> = new Subject()
  readonly components: IComponent[] = []

  parent: Scene | SceneBase
  name: string
  x: number
  y: number

  constructor(name = 'GameObject', x = 0, y = 0) {
    this.name = name
    this.x = x
    this.y = y
  }

  static async instantiate(prefab: Prefab): Promise<GameObject> {
    return await prefab.instantiate()
  }

  update(): void {
    this.components.forEach((component: IComponent) => component.update())

    Lifecycle.update(this)
  }

  destroy(): void {
    this.components.forEach((component: IComponent) => component.destroy())

    Lifecycle.destroy(this)
  }

  addComponent(component: IComponent): boolean {
    if (this.components.includes(component)) {
      return false
    }

    this.components.push(component)

    return true
  }

  removeComponent(component: IComponent): boolean {
    if (!this.components.includes(component)) {
      return false
    }

    this.components.splice(this.components.indexOf(component), 1)

    return true
  }

  getComponentOfType(type: string): IComponent {
    return this.components.find(({ name }) => name === type)
  }

  getComponentsOfType(type: string): IComponent[] {
    return this.components.filter(({ name }) => name === type)
  }
}
