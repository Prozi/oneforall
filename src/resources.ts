import * as PIXI from 'pixi.js';

import { Cache } from '@pietal.dev/cache';
import { Injectable } from '@pietal.dev/dependency-injection';

// tslint:disable-next-line: no-any
export type PIXIResource = any;

@Injectable
export class Resources {
  static cache: Cache<PIXIResource> = new Cache(async (url: string) => {
    return PIXI.Assets.loader.load(url);
  });

  static async loadResource<T = PIXIResource>(url: string): Promise<T> {
    return (await Resources.cache.get(url)) as T;
  }

  static async loadResources<T = PIXIResource>(
    resources: string[]
  ): Promise<{ [name: string]: T }> {
    const promises = resources.map(async (url) => Resources.loadResource(url));
    const results = await Promise.all(promises);

    return results.reduce((resolved, resource, index) => {
      const name = resources[index];

      return {
        ...resolved,
        [name]: resource
      };
    }, {});
  }

  async get<T = PIXIResource>(url: string): Promise<T> {
    return Resources.loadResource<T>(url);
  }
}
