import * as PIXI from "pixi.js";
import { Injectable } from "@jacekpietal/dependency-injection";

declare var jest: object;

@Injectable
export class Application extends PIXI.Application {
  constructor(options: Partial<PIXI.IApplicationOptions> = {}) {
    super({
      autoStart: false,
      sharedTicker: false,
      ...options,
    });
  }
}
