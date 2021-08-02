import * as PIXI from 'pixi.js'
import { Singleton } from 'ts-dependency-injection'

@Singleton
export class Application extends PIXI.Application {
  constructor(options: PIXI.IApplicationOptions = {}) {
    super({
      autoStart: false,
      sharedTicker: false,
      sharedLoader: false,
      ...options
    })
  }
}
