import * as PIXI from 'pixi.js'
import { Inject } from '@jacekpietal/dependency-injection'
import { Application } from './application'
import { Resources } from './resources'
import { SceneBase, SceneOptions } from './scene-base'
import { fromEvent, takeUntil } from 'rxjs'

export class Scene extends SceneBase {
  @Inject(Application) pixi: Application
  @Inject(Resources) resouces: Resources

  stage: PIXI.Container = new PIXI.Container()

  constructor(options: SceneOptions = {}) {
    super(options)

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

  start(): void {
    this.pixi.stage.scale.set(this.scale)
    this.pixi.start()

    super.start()
  }

  stop(): void {
    this.pixi.stop()

    super.stop()
  }

  destroy(): void {
    this.stage.parent.removeChild(this.stage)
    this.stage.destroy()

    super.destroy()
  }

  enableAutoSort(): void {
    this.update$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.stage.children.sort(
        (a: PIXI.DisplayObject, b: PIXI.DisplayObject) => a.y - b.y
      )
    })
  }

  enableAutoSize(): void {
    this.pixi.renderer.resize(innerWidth, innerHeight)

    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.pixi.renderer.resize(innerWidth, innerHeight)
      })
  }
}
