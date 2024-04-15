import { Cache } from 'latermom';
export type PIXIResource = any;
export declare class Resources {
    static cache: Cache<PIXIResource>;
    static loadResource<T = PIXIResource>(url: string): Promise<T>;
    static loadResources<T = PIXIResource>(resources: string[]): Promise<{
        [name: string]: T;
    }>;
    get<T = PIXIResource>(url: string): Promise<T>;
}
//# sourceMappingURL=resources.d.ts.map