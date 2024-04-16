import { Body } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { merge } from 'rxjs/internal/observable/merge';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { addStats, StatsJSAdapter } from 'pixi-stats';

import { Inject } from '@jacekpietal/dependency-injection';

import { Application } from './application';
import { Resources } from './resources';
import { SceneBase, SceneOptions } from './scene-base';

export class Scene<TBody extends Body = Body> extends SceneBase<TBody> {
  @Inject(Application) pixi: Application;
  @Inject(Resources) resources: Resources;

  /**
   * When auto sort is set to false, it emits this subject.
   */
  readonly disableAutoSort$: Subject<void> = new Subject();

  constructor(options: SceneOptions = {}) {
    super();

    this.stage.visible = this.options.visible || false;
    this.pixi.stage.addChild(this.stage);

    // for chrome plugin pixi debug devtools
    globalThis.__PIXI_APP__ = this.pixi;

    if (options.autoSort) {
      this.enableAutoSort();
    }
  }

  async init(options?: Partial<PIXI.ApplicationOptions>): Promise<void> {
    await this.pixi.init(options);

    document.body.appendChild(this.pixi.canvas);

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

  disableAutoSort(): void {
    this.disableAutoSort$.next();
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
