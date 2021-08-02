var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Resources_1;
import Cache from 'latermom';
import * as PIXI from 'pixi.js';
import { Injectable } from '@jacekpietal/dependency-injection';
let Resources = Resources_1 = class Resources {
    constructor(path = '/') {
        this.cache = new Cache(async (url) => {
            try {
                return await Resources_1.loadResource(`${path}${url}`);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    static loadResource(path) {
        const resource = PIXI.Loader.shared.resources[path];
        if (resource) {
            return Promise.resolve(resource);
        }
        return new Promise((resolve) => {
            const loader = new PIXI.Loader();
            loader.add(path);
            loader.load(() => {
                Object.assign(PIXI.Loader.shared.resources, {
                    [path]: loader.resources[path]
                });
                resolve(loader.resources[path]);
            });
        });
    }
    static loadResources(resources) {
        return new Promise((resolve) => {
            const loader = new PIXI.Loader();
            loader.add(resources);
            loader.load(() => {
                Object.assign(PIXI.Loader.shared.resources, loader.resources);
                resolve(PIXI.Loader.shared.resources);
            });
        });
    }
    async get(url) {
        return this.cache.get(url);
    }
};
Resources = Resources_1 = __decorate([
    Injectable
], Resources);
export { Resources };
