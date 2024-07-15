import { Body } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { Application } from './application';
import { Resources } from './resources';
import { SceneSSR, SceneOptions } from './scene-ssr';
export declare class Scene<TBody extends Body = Body> extends SceneSSR<TBody> {
  pixi: Application;
  resources: Resources;
  /**
   * When disableAutoSort is called, it emits this subject.
   */
  readonly disableAutoSort$: Subject<void>;
  /**
   * When disableDebug is called, it emits this subject.
   */
  readonly disableDebug$: Subject<void>;
  constructor(options?: SceneOptions);
  static getQueryParams(): Record<string, string>;
  init(options?: Partial<PIXI.ApplicationOptions>): Promise<void>;
  start(): void;
  stop(): void;
  destroy(): void;
  enableAutoSort(): void;
  disableAutoSort(): void;
  enableDebug(): void;
  disableDebug(): void;
  /**
   * add body font family to set font of pixi-stats
   */
  showFPS(style?: string): void;
}
//# sourceMappingURL=scene.d.ts.map
