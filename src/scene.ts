import * as PIXI from 'pixi.js'
import { fromEvent, Subject, takeUntil } from 'rxjs'
import { Inject } from '@jacekpietal/dependency-injection'
import { Application } from './application'
import { GameObject } from './game-object'
import { Physics } from './physics'
import { Resources } from './resources'
import { Lifecycle } from './component'

export class Scene extends Lifecycle {
  readonly name: string
  readonly children: Set<GameObject> = new Set()
  readonly children$: Subject<void> = new Subject()

  @Inject(Application) pixi: Application
  @Inject(Resources) resouces: Resources
  @Inject(Physics) physics: Physics

  container: PIXI.Container = new PIXI.Container()
  destroy$: Subject<void> = new Subject()
  animationFrame: number

  constructor(
    options: {
      name?: string
      visible?: boolean
      autoSize?: boolean
      autoSort?: boolean
      scale?: number
    } = {}
  ) {
    super()
    this.name = options.name || 'Scene'

    this.container.visible = options.visible || false
    this.container.scale.set(options.scale || 1)

    if (options.autoSize) {
      this.enableAutoSize()
    }

    if (options.autoSort) {
      this.enableAutoSort()
    }

    this.stage.addChild(this.container)
  }

  get stage(): PIXI.Container {
    return this.pixi.stage
  }

  stop(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }

    this.pixi.stop()
  }

  start(): void {
    const loop = () => {
      this.update()

      this.animationFrame = requestAnimationFrame(loop)
    }

    loop()

    this.stage.scale.set(this.container.scale.x, this.container.scale.y)
    this.pixi.start()
  }

  enableAutoSize(): void {
    this.pixi.renderer.resize(innerWidth, innerHeight)

    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.pixi.renderer.resize(innerWidth, innerHeight)
      })
  }

  enableAutoSort(): void {
    this.update$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.pixi.stage.children.sort((a, b) => a.y - b.y)
    })
  }

  update(): void {
    this.physics.update()

    Array.from(this.children.values()).forEach((child: GameObject) =>
      child.update()
    )

    super.update()
  }

  destroy(): void {
    this.stage.removeChild(this.container)
    this.container.destroy()
    this.stop()

    super.destroy()
  }

  addChild(child: GameObject): void {
    if (this.children.has(child)) {
      return
    }

    child.parent = this

    this.children.add(child)
    this.children$.next()
  }

  removeChild(child: GameObject): void {
    if (!this.children.has(child)) {
      return
    }

    child.parent = null

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
