import * as PIXI from 'pixi.js';
import { SceneOptions, SceneSSR } from './scene-ssr';
import { Application, PIXIAppOptions } from './application';
import { Body } from 'detect-collisions';
import { LifecycleProps } from './lifecycle';
import { Resources } from './resources';
import { Subject } from 'rxjs/internal/Subject';
export type PIXIWebGLRenderer = any;
export type PIXICanvas = any;
/**
 * base scene for front end rendering
 */
export declare class Scene<TBody extends Body = Body> extends SceneSSR<TBody> {
  pixi: Application;
  resources: Resources;
  isInitialized: boolean;
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
  init(options?: PIXIAppOptions): Promise<boolean>;
  start(): void;
  stop(): void;
  destroy(): void;
  addChild(
    gameObject: LifecycleProps & {
      sprite?: PIXI.Container;
      body?: TBody;
    }
  ): void;
  enableAutoSort(): void;
  disableAutoSort(): void;
  enableDebug(): void;
  disableDebug(): void;
  /**
   * add body font family to set font of pixi-stats
   */
  showFPS(style?: string): void;
  protected onUpdateDebug(graphics: PIXI.Graphics): void;
  resize(): void;
}
//# sourceMappingURL=scene.d.ts.map
