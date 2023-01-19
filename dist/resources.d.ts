import * as PIXI from 'pixi.js';
export declare class Resources {
    private cache;
    constructor(path?: string);
    static loadResource<T = PIXI.Resource>(path: string): Promise<T>;
    static loadResources<T = PIXI.Resource>(resources: string[]): Promise<{
        [name: string]: T;
    }>;
    get<T = PIXI.Resource>(url: string): Promise<T>;
}
//# sourceMappingURL=resources.d.ts.map