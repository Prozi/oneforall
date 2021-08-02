import * as PIXI from 'pixi.js'
import { Injectable } from '@jacekpietal/dependency-injection'

@Injectable
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
