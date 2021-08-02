import * as PIXI from 'pixi.js'
import { AutoInject } from 'ts-dependency-injection'
import { Application } from './application'
import { Lifecycle } from './component'

export class Scene extends Lifecycle {
  readonly name: string = 'Scene'

  @AutoInject(Application)
  app: Application

  container: PIXI.Container = new PIXI.Container()

  constructor(visible: boolean = false) {
    super()

    this.container.visible = visible
    this.stage.addChild(this.container)
  }

  get stage(): PIXI.Container {
    return this.app.stage
  }

  destroy(): void {
    this.stage.removeChild(this.container)
    this.container.destroy()

    super.destroy()
  }
}
