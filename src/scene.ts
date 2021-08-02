import * as PIXI from 'pixi.js'
import { fromEvent, Subject, takeUntil } from 'rxjs'
import { AutoInject } from '@jacekpietal/dependency-injection'
import { Application } from './application'
import { GameObject } from './game-object'
import { Physics } from './physics'
import { Resources } from './resources'

export class Scene {
  readonly name: string
  readonly children: Set<GameObject> = new Set()
  readonly children$: Subject<void> = new Subject()

  @AutoInject(Application) pixi: Application
  @AutoInject(Resources) resouces: Resources
  @AutoInject(Physics) physics: Physics

  container: PIXI.Container = new PIXI.Container()
  destroy$: Subject<void> = new Subject()

  constructor(
    options: {
      name?: string
      visible?: boolean
      autoSize?: boolean
      scale?: number
    } = {}
  ) {
    this.name = options.name || 'Scene'

    this.container.visible = options.visible || false
    this.container.scale.set(options.scale || 1)

    if (options.autoSize) {
      this.enableAutoSize()
    }

    this.stage.addChild(this.container)
  }

  get stage(): PIXI.Container {
    return this.pixi.stage
  }

  enableAutoSize(): void {
    this.pixi.renderer.resize(innerWidth, innerHeight)

    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.pixi.renderer.resize(innerWidth, innerHeight)
      })
  }

  update(): void {
    this.physics.update()

    Array.from(this.children.values()).forEach((child: GameObject) =>
      child.update()
    )
  }

  destroy(): void {
    this.stage.removeChild(this.container)
    this.container.destroy()

    this.destroy$.next()
    this.destroy$.complete()
  }

  addChild(child: GameObject): void {
    if (this.children.has(child)) {
      return
    }

    this.children.add(child)
    this.children$.next()
  }

  removeChild(child: GameObject): void {
    if (!this.children.has(child)) {
      return
    }

    this.children.delete(child)
    this.children$.next()
  }

  getChildOfType(type: string): GameObject {
    return Array.from(this.children.values()).find(({ name }) => name === type)
  }

  getChildrenOfType(type: string): GameObject[] {
    return Array.from(this.children.values()).filter(
      ({ name }) => name === type
    )
  }
}
