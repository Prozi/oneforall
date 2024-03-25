import * as PIXI from 'pixi.js';

import { Injectable } from '@jacekpietal/dependency-injection';

@Injectable
export class Application extends PIXI.Application {
  private isInitialized = false;

  async init(options?: Partial<PIXI.ApplicationOptions>): Promise<void> {
    if (!this.isInitialized) {
      this.isInitialized = true;
      await super.init(options);
    }
  }
}
