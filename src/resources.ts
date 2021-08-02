import Cache from 'latermom'
import * as PIXI from 'pixi.js'
import { Injectable } from '@jacekpietal/dependency-injection'

@Injectable
export class Resources {
  private cache: Cache

  constructor(path: string = '/') {
    this.cache = new Cache(async (url: string) => {
      try {
        return await Resources.loadResource(`${path}${url}`)
      } catch (err) {
        console.error(err)
      }
    })
  }

  static loadResource(path: string): Promise<PIXI.ILoaderResource> {
    const resource: PIXI.ILoaderResource = PIXI.Loader.shared.resources[path]

    if (resource) {
      return Promise.resolve(resource)
    }

    return new Promise((resolve) => {
      const loader: PIXI.Loader = new PIXI.Loader()

      loader.add(path)
      loader.load(() => {
        Object.assign(PIXI.Loader.shared.resources, {
          [path]: loader.resources[path]
        })

        resolve(loader.resources[path])
      })
    })
  }

  static loadResources(
    resources: string[]
  ): Promise<{ [name: string]: PIXI.ILoaderResource }> {
    return new Promise((resolve) => {
      const loader: PIXI.Loader = new PIXI.Loader()

      loader.add(resources)
      loader.load(() => {
        Object.assign(PIXI.Loader.shared.resources, loader.resources)

        resolve(PIXI.Loader.shared.resources)
      })
    })
  }

  async get(url: string): Promise<PIXI.ILoaderResource> {
    return this.cache.get(url)
  }
}
