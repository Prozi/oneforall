import * as PIXI from 'pixi.js';
export declare class Resources {
    private cache;
    constructor(path?: string);
    static loadResource(path: string): Promise<PIXI.ILoaderResource>;
    static loadResources(resources: string[]): Promise<{
        [name: string]: PIXI.ILoaderResource;
    }>;
    get(url: string): Promise<PIXI.ILoaderResource>;
}
//# sourceMappingURL=resources.d.ts.map