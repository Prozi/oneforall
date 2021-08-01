import { Subject } from 'rxjs'
import { IComponent } from './component'
import { Prefab } from './prefab'

export class GameObject {
  readonly components: Set<IComponent> = new Set()
  readonly components$: Subject<void> = new Subject()

  name: string
  x: number
  y: number

  constructor(name: string = 'GameObject', x: number = 0, y: number = 0) {
    this.name = name
    this.x = x
    this.y = y
  }

  static instantiate(prefab: Prefab): GameObject {
    return prefab.instantiate()
  }

  update(): void {
    const components: IComponent[] = Array.from(this.components.values())

    components.forEach((component: IComponent) => component.update())
  }

  addComponent(component: IComponent): void {
    if (this.components.has(component)) {
      return
    }

    this.components.add(component)
    this.components$.next()
  }

  removeComponent(component: IComponent): void {
    if (!this.components.has(component)) {
      return
    }

    this.components.delete(component)
    this.components$.next()
  }

  getComponentOfType(type: string): IComponent {
    const components: IComponent[] = Array.from(this.components.values())

    return components.find(({ name }) => name === type)
  }

  getComponentsOfType(type: string): IComponent[] {
    const components: IComponent[] = Array.from(this.components.values())

    return components.filter(({ name }) => name === type)
  }
}
