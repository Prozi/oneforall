import * as PIXI from 'pixi.js';
import { SceneOptions, SceneSSR } from './scene-ssr';
import { Application } from './application';
import { Body } from 'detect-collisions';
import { LifecycleProps } from './lifecycle';
import { Resources } from './resources';
import { Subject } from 'rxjs/internal/Subject';
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
  init(options?: Partial<PIXI.ApplicationOptions>): Promise<boolean>;
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
  protected onUpdateDebug(debug: PIXI.Graphics): void;
}
//# sourceMappingURL=scene.d.ts.map
