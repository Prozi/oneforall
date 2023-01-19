import Cache from "latermom";
import * as PIXI from "pixi.js";
import { Injectable } from "@jacekpietal/dependency-injection";

@Injectable
export class Resources {
  private cache: Cache;

  constructor(path = "") {
    this.cache = new Cache(async (url: string) => {
      try {
        return await Resources.loadResource(`${path}${url}`);
      } catch (err) {
        console.error(err);
      }
    });
  }

  static loadResource<T = PIXI.Resource>(path: string): Promise<T> {
    const { loader } = PIXI.Assets;

    return loader.load(path);
  }

  static loadResources<T = PIXI.Resource>(
    resources: string[]
  ): Promise<{ [name: string]: T }> {
    const promises = resources.map((path) => PIXI.Assets.load(path));

    return new Promise((resolve) => {
      Promise.all(promises).then((resolved) =>
        resolve(
          resolved.reduce(
            (result, loaded, index) => ({
              ...result,
              [resources[index]]: loaded,
            }),
            {}
          )
        )
      );
    });
  }

  async get<T = PIXI.Resource>(url: string): Promise<T> {
    return this.cache.get(url);
  }
}
