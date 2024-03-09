import * as PIXI from "pixi.js";
import { Injectable } from "@jacekpietal/dependency-injection";

declare var jest: object;

@Injectable
export class Application extends PIXI.Application {
  async init(options: Partial<PIXI.ApplicationOptions> = {}) {
    return super.init({
      autoStart: false,
      sharedTicker: false,
      ...options,
    });
  }
}
