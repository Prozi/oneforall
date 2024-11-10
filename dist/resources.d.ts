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
export declare class Resources {
  static cache: Cache<PIXIResource>;
  static loadResource<T = PIXIResource>(url: string): Promise<T>;
  static loadResources<T = PIXIResource>(
    resources: string[]
  ): Promise<{
    [name: string]: T;
  }>;
  static get<T = PIXIResource>(url: string): Promise<T>;
  protected static load(url: string): Promise<unknown>;
}
//# sourceMappingURL=resources.d.ts.map
