export type PIXIResource = any;
export declare class Resources {
    private cache;
    constructor(path?: string, cacheSize?: number);
    static loadResource<T = PIXIResource>(path: string): Promise<T>;
    static loadResources<T = PIXIResource>(resources: string[]): Promise<{
        [label: string]: T;
    }>;
    get(url: string): Promise<PIXIResource>;
}
//# sourceMappingURL=resources.d.ts.map