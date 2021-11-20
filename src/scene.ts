import * as PIXI from 'pixi.js'
import { fromEvent, Subject, takeUntil } from 'rxjs'
import { System } from 'detect-collisions'
import { Inject } from '@jacekpietal/dependency-injection'
import { Application } from './application'
import { GameObject } from './game-object'
import { Resources } from './resources'
import { Lifecycle } from './component'

export class Scene extends Lifecycle {
  readonly name: string
  readonly children: Set<GameObject> = new Set()
  readonly children$: Subject<void> = new Subject()

  @Inject(Application) pixi: Application
  @Inject(Resources) resouces: Resources

  physics: System = new System()
  scale: number
  stage: PIXI.Container = new PIXI.Container()
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
    this.scale = options.scale || 1

    // 1 additonal layer
    this.stage.visible = options.visible || false

    if (options.autoSize) {
      this.enableAutoSize()
    }

    if (options.autoSort) {
      this.enableAutoSort()
    }

    // real stage
    this.pixi.stage.addChild(this.stage)
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

    this.pixi.stage.scale.set(this.scale)
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
      this.stage.children.sort((a, b) => a.y - b.y)
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
    this.stage.parent?.removeChild(this.stage)
    this.stage.destroy()
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
