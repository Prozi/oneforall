import { Cache } from 'latermom';
import * as PIXI from 'pixi.js';

import { Injectable } from '@jacekpietal/dependency-injection';

// tslint:disable-next-line: no-any
export type PIXIResource = Record<string, any>;

@Injectable
export class Resources {
  private cache: Cache<Promise<PIXIResource | undefined>>;

  constructor(path = '', cacheSize = 64) {
    this.cache = new Cache(async (url: string) => {
      try {
        return await Resources.loadResource(`${path}${url}`);
      } catch (err) {
        console.error(err);
      }
    }, cacheSize);
  }

  static loadResource<T = PIXIResource>(path: string): Promise<T> {
    const { loader } = PIXI.Assets;

    return loader.load(path);
  }

  static loadResources<T = PIXIResource>(
    resources: string[]
  ): Promise<{ [label: string]: T }> {
    const promises = resources.map((path) => PIXI.Assets.load(path));

    return new Promise((resolve) => {
      Promise.all(promises).then((resolved) =>
        resolve(
          resolved.reduce(
            (result, loaded, index) => ({
              ...result,
              [resources[index]]: loaded
            }),
            {}
          )
        )
      );
    });
  }

  async get(url: string): Promise<PIXIResource | undefined> {
    return this.cache.get(url);
  }
}
