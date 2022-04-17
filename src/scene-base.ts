import * as PIXI from 'pixi.js'
import { Subject } from 'rxjs'
import { System } from 'detect-collisions'
import { GameObject } from './game-object'
import { Lifecycle } from './lifecycle'

export type SceneOptions = {
  name?: string
  visible?: boolean
  autoSize?: boolean
  autoSort?: boolean
  scale?: number
}

export interface IStage {
  addChild: (child: PIXI.DisplayObject) => void
  removeChild: (child: PIXI.DisplayObject) => void
  children: PIXI.DisplayObject[]
  scale: PIXI.Point
}

export class SceneBase extends Lifecycle {
  readonly name: string
  readonly children: Set<GameObject> = new Set()
  readonly children$: Subject<void> = new Subject()

  stage: IStage = {
    addChild() {
      console.warn('missing addChild implementation')
    },
    removeChild() {
      console.warn('missing removeChild implementation')
    },
    children: [],
    scale: new PIXI.Point(1, 1)
  }
  physics: System = new System()
  scale: number
  destroy$: Subject<void> = new Subject()
  animationFrame: number

  constructor(options: SceneOptions = {}) {
    super()

    this.name = options.name || 'Scene'
    this.scale = options.scale || 1
  }

  stop(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
  }

  start(): void {
    const loop = () => {
      this.update()

      this.animationFrame = requestAnimationFrame(loop)
    }

    loop()
  }

  update(): void {
    this.physics.update()

    Array.from(this.children.values()).forEach((child: GameObject) =>
      child.update()
    )

    super.update()
  }

  destroy(): void {
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
