import * as PIXI from 'pixi.js';

import { DIContainer, Inject } from 'inject.min';
import { PIXIAppOptions, SceneOptions, SceneSSR } from './scene-ssr';

import { Body } from 'detect-collisions';
import { LifecycleProps } from './lifecycle';
import { Resources } from './resources';
import { Stats } from 'pixi-stats';
import { Subject } from 'rxjs/internal/Subject';
import { fromEvent } from 'rxjs';
import { merge } from 'rxjs/internal/observable/merge';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

export type PIXIWebGLRenderer = any;

export type PIXICanvas = any;

/**
 * base scene for front end rendering
 */
export class Scene<TBody extends Body = Body> extends SceneSSR<TBody> {
  @Inject(Resources) resources: Resources;

  pixi: PIXI.Application;
  isInitialized = false;
  stage = new PIXI.Container();

  /**
   * When disableAutoSort is called, it emits this subject.
   */
  readonly disableAutoSort$: Subject<void> = new Subject();

  /**
   * When disableDebug is called, it emits this subject.
   */
  readonly disableDebug$: Subject<void> = new Subject();

  constructor({ view, ...options }: SceneOptions = {}) {
    super(options);

    const nameKey = 'label' in this.stage ? 'label' : 'name';

    this.pixi = this.createPixi({ view, ...options });

    this.stage[nameKey] = 'SceneStage';
    this.stage.visible = this.options.visible || false;

    if (this.pixi) {
      this.pixi.stage.addChild(this.stage);
      this.pixi.stage[nameKey] = 'PixiStage';
    }

    if (this.options.autoSort) {
      this.enableAutoSort();
    }

    if (this.options.debug) {
      this.enableDebug();
    }

    globalThis.PIXI = PIXI;
    globalThis.scene = this;
    globalThis.__PIXI_APP__ = this.pixi;
  }

  static getQueryParams(): Record<string, string> {
    if (typeof location === 'undefined') {
      return {};
    }

    const matches = location.search.matchAll(/[?&]([^=?&]+)=?([^?&]*)/g);

    return [...matches].reduce(
      (queryParams, [_wholeMatch, paramName, paramValue]) => ({
        ...queryParams,
        [decodeURIComponent(paramName)]: decodeURIComponent(paramValue)
      }),
      {}
    );
  }

  createPixi(options: PIXIAppOptions): PIXI.Application {
    return DIContainer.getInstance(PIXI.Application, options);
  }

  async init(options?: PIXIAppOptions): Promise<boolean> {
    if (this.isInitialized) {
      return false;
    }

    this.isInitialized = true;

    const pixi = this.pixi as {
      init?: (options?: PIXIAppOptions) => Promise<void>;
    };

    await pixi.init?.(options);

    const canvasKey = 'canvas' in this.pixi ? 'canvas' : 'view';

    if (this.pixi[canvasKey] && !this.pixi[canvasKey].parentElement) {
      document.body.appendChild(this.pixi[canvasKey]);
    }

    const showFPS = this.options.showFPS;
    if (showFPS) {
      this.showFPS(typeof showFPS === 'string' ? showFPS : undefined);
    }

    // pixi v6 or v7
    if (!PIXI.VERSION.startsWith('8.')) {
      this.resize();

      fromEvent(document, 'fullscreenchange', { passive: true })
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.resize();
        });

      fromEvent(window, 'resize', { passive: true })
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.resize();
        });
    }

    return true;
  }

  start(): void {
    this.pixi?.start();
    super.start();
  }

  stop(): void {
    this.pixi?.stop?.();
    super.stop();
  }

  destroy(): void {
    super.destroy();
    this.pixi?.stage.removeChild(this.stage);
  }

  stageAddChild(...children: LifecycleProps[]): void {
    children.forEach((child) => {
      this.recursive(child, (deep) => {
        if (deep instanceof PIXI.Container) {
          this.stage.addChild(deep);
        }
      });
    });
  }

  stageRemoveChild(...children: LifecycleProps[]): void {
    children.forEach((child) => {
      this.recursive(child, (deep) => {
        if (deep instanceof PIXI.Container) {
          this.stage.removeChild(deep);
        }
      });
    });
  }

  addChild(
    gameObject: LifecycleProps & { sprite?: PIXI.Container; body?: TBody }
  ): void {
    super.addChild(gameObject);

    if (gameObject.sprite) {
      this.stage.addChild(gameObject.sprite);
    }
  }

  enableAutoSort(): void {
    this.stage.sortableChildren = true;

    this.update$
      .pipe(takeUntil(merge(this.destroy$, this.disableAutoSort$)))
      .subscribe(() => {
        this.stage.children.forEach((child) => {
          child.zIndex = child.y;
        });
      });
  }

  disableAutoSort(): void {
    this.stage.sortableChildren = false;

    this.disableAutoSort$.next();
  }

  enableDebug(): void {
    const debug = new PIXI.Graphics();

    this.pixi.stage.addChild(debug);
    this.update$
      .pipe(takeUntil(merge(this.destroy$, this.disableDebug$)))
      .subscribe(() => {
        try {
          this.onUpdateDebug(debug);
        } catch (_err) {}
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
    const stats = new Stats(
      this.pixi.renderer as PIXIWebGLRenderer,
      document.body,
      this.pixi.ticker
    );

    stats.domElement.setAttribute('style', style);
  }

  protected onUpdateDebug(graphics: PIXI.Graphics): void {
    const context = graphics as unknown as CanvasRenderingContext2D;
    const graphicsUniversal = graphics as any;
    const isPIXIv6 = 'stroke' in graphicsUniversal;
    const debug =
      typeof this.options.debug === 'object' ? this.options.debug : {};

    graphicsUniversal.clear();

    if (!isPIXIv6) {
      graphicsUniversal.lineStyle(
        debug.debugStroke?.width || 1.5,
        debug.debugStroke?.color || 0xffffff,
        debug.debugStroke?.alpha || 1
      );
    }
    this.physics.draw(context);
    if (isPIXIv6) {
      graphicsUniversal.stroke(
        debug.debugStroke || {
          color: 0xffffff,
          width: 1.5,
          alpha: 1
        }
      );
    }

    if (!isPIXIv6) {
      graphicsUniversal.lineStyle(
        debug.debugBVHStroke?.width || 1,
        debug.debugBVHStroke?.color || 0x00ff00,
        debug.debugBVHStroke?.alpha || 0.5
      );
    }
    this.physics.drawBVH(context);
    if (isPIXIv6) {
      graphicsUniversal.stroke(
        debug.debugBVHStroke || {
          color: 0x00ff00,
          width: 1,
          alpha: 0.5
        }
      );
    }
  }

  resize(): void {
    try {
      const canvas = (('canvas' in this.pixi && this.pixi.canvas) ||
        ('view' in this.pixi && this.pixi.view)) as HTMLCanvasElement;

      this.pixi.renderer.resize(innerWidth, innerHeight);

      canvas.width = innerWidth;
      canvas.height = innerHeight;
    } catch (_err) {}
  }
}
