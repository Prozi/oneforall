import * as PIXI from 'pixi.js'
import { Injectable } from '@jacekpietal/dependency-injection'

declare var jest: object

@Injectable
export class Application extends PIXI.Application {
  constructor(options: PIXI.IApplicationOptions = {}) {
    super({
      autoStart: false,
      sharedTicker: false,
      sharedLoader: false,
      ...options
    })

    // silent fail in tests
    if (typeof jest === 'undefined') {
      document.body.appendChild(this.view)
    }
  }
}
