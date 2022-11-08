import * as PIXI from 'pixi.js';
export declare class Resources {
    private cache;
    constructor(path?: string);
    static loadResource(path: string): Promise<PIXI.LoaderResource>;
    static loadResources(resources: string[]): Promise<{
        [name: string]: PIXI.LoaderResource;
    }>;
    get(url: string): Promise<PIXI.LoaderResource>;
}
//# sourceMappingURL=resources.d.ts.map