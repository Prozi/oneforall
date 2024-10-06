import * as PIXI from 'pixi.js';

export class Application extends PIXI.Application {
  isInitialized = false;

  async init(options?: Partial<PIXI.ApplicationOptions>): Promise<void> {
    if (!this.isInitialized) {
      this.isInitialized = true;
      await super.init(options);
    }
  }
}
