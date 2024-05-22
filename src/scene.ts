import { Body } from 'detect-collisions';
import { addStats, StatsJSAdapter } from 'pixi-stats';
import * as PIXI from 'pixi.js';
import { merge } from 'rxjs/internal/observable/merge';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';

import { Inject } from '@pietal.dev/dependency-injection';

import { Application } from './application';
import { Resources } from './resources';
import { SceneSSR, SceneOptions } from './scene-ssr';

export class Scene<TBody extends Body = Body> extends SceneSSR<TBody> {
  @Inject(Application) pixi: Application;
  @Inject(Resources) resources: Resources;

  /**
   * When disableAutoSort is called, it emits this subject.
   */
  readonly disableAutoSort$: Subject<void> = new Subject();

  /**
   * When disableDebug is called, it emits this subject.
   */
  readonly disableDebug$: Subject<void> = new Subject();

  constructor(options: SceneOptions = {}) {
    super(options);

    this.stage.visible = this.options.visible || false;
    this.pixi.stage.addChild(this.stage);

    if (this.options.autoSort) {
      this.enableAutoSort();
    }

    if (this.options.debug) {
      this.enableDebug();
    }

    // for chrome plugin pixi debug devtools
    globalThis.__PIXI_APP__ = this.pixi;
  }

  static getQueryParams(): Record<string, string> {
    const matches = location.search.matchAll(/[?&]([^=?&]+)=?([^?&]*)/g);

    return [...matches].reduce(
      (queryParams, [_wholeMatch, paramName, paramValue]) => ({
        ...queryParams,
        [paramName]: paramValue
      }),
      {}
    );
  }

  async init(options?: Partial<PIXI.ApplicationOptions>): Promise<void> {
    await this.pixi.init(options);

    if (this.pixi.canvas && !this.pixi.canvas.parentElement) {
      document.body.appendChild(this.pixi.canvas);
    }

    const showFPS = this.options.showFPS;
    if (showFPS) {
      this.showFPS(typeof showFPS === 'string' ? showFPS : undefined);
    }
  }

  start(): void {
    this.pixi.start();
    super.start();
  }

  stop(): void {
    this.pixi.stop?.();
    super.stop();
  }

  destroy(): void {
    super.destroy();
    this.pixi.stage.removeChild(this.stage);
  }

  enableAutoSort(): void {
    this.update$
      .pipe(takeUntil(merge(this.destroy$, this.disableAutoSort$)))
      .subscribe(() => {
        this.stage.children.sort(
          (bodyA: PIXI.Container, bodyB: PIXI.Container) => bodyA.y - bodyB.y
        );
      });
  }

  disableAutoSort(): void {
    this.disableAutoSort$.next();
  }

  enableDebug(): void {
    const debug = new PIXI.Graphics();
    const canvas = debug as unknown as CanvasRenderingContext2D;

    this.pixi.stage.addChild(debug);
    this.update$
      .pipe(takeUntil(merge(this.destroy$, this.disableDebug$)))
      .subscribe(() => {
        debug.clear();
        this.physics.drawBVH(canvas);
        this.physics.draw(canvas);
        debug.stroke();
      });
  }

  disableDebug(): void {
    this.disableDebug$.next();
    this.pixi.stage.children.forEach((child) => {
      if (child instanceof PIXI.Graphics) {
        this.pixi.stage.removeChild(child);
        child.destroy();
      }
    });
  }

  /**
   * add body font family to set font of pixi-stats
   */
  showFPS(style = 'position: fixed; top: 0; right: 0; z-index: 1000;'): void {
    const stats: StatsJSAdapter = addStats(document, this.pixi);
    const ticker: PIXI.Ticker = PIXI.Ticker.shared;
    const canvas = stats.stats.domElement;

    canvas.setAttribute('style', style);
    ticker.add(stats.update, stats, PIXI.UPDATE_PRIORITY.UTILITY);
  }
}
