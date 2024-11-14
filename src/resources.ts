import * as PIXI from 'pixi.js';

import { Cache } from '@pietal.dev/cache';

export type PIXIResource = any;

export type PIXIv6LoaderCallback = (
  loader: PIXIv6Loader,
  resources: Record<string, PIXIResource>
) => void;

export interface PIXIv6Loader {
  add: (url: string) => void;
  load: (loader: PIXIv6LoaderCallback) => void;
}

export interface PIXIv8Loader {
  load: (url: string) => Promise<PIXIResource>;
}

export interface PIXIv8Assets {
  loader: PIXIv8Loader;
}

export interface PIXIv8 {
  Assets?: PIXIv8Assets;
}

export class Resources {
  static cache: Cache<PIXIResource> = new Cache(async (url: string) => {
    return Resources.load(url);
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

  static async get<T = PIXIResource>(url: string): Promise<T> {
    return await Resources.loadResource<T>(url);
  }

  protected static async load(url: string) {
    return new Promise((resolve, reject) => {
      if ('Assets' in PIXI) {
        const { loader } = (PIXI as PIXIv8).Assets!;

        loader.load(url).then(resolve).catch(reject);
      } else {
        const loader = new (PIXI as any).Loader();

        loader.add(url);
        loader.onError.add(reject);
        loader.load((_: PIXIv6Loader, resources: Record<string, any>) => {
          const response = resources[url];

          resolve(response.texture || response.data);
        });
      }
    });
  }
}
