import * as PIXI from 'pixi.js';
export declare class Resources {
    private cache;
    constructor(path?: string, cacheSize?: number);
    static loadResource<T = PIXI.Resource>(path: string): Promise<T>;
    static loadResources<T = PIXI.Resource>(resources: string[]): Promise<{
        [name: string]: T;
    }>;
    get(url: string): Promise<PIXI.Resource>;
}
//# sourceMappingURL=resources.d.ts.map