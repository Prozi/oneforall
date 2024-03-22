import * as PIXI from 'pixi.js';
import { Body } from 'detect-collisions';
import { takeUntil } from 'rxjs/operators';
import { Inject } from '@jacekpietal/dependency-injection';
import { Application } from './application';
import { Resources } from './resources';
import { SceneBase, SceneOptions } from './scene-base';
import { PIXIDisplayObject } from './stage-base';

export class Scene<TBody extends Body = Body> extends SceneBase<TBody> {
  @Inject(Application) pixi: Application;
  @Inject(Resources) resouces: Resources;

  options: SceneOptions = {};

  constructor(options: SceneOptions = {}) {
    super();

    this.options = options;

    // 1 additonal layer
    this.visible = options.visible || false;

    if (options.autoSort) {
      this.enableAutoSort();
    }

    // real stage
    this.pixi.stage.addChild(this);
  }

  async init(options?: Partial<PIXI.ApplicationOptions>): Promise<void> {
    this.pixi.init(options);

    document.body.appendChild(this.pixi.canvas);
  }

  start(): void {
    this.pixi.stage.scale.set(this.scale.x, this.scale.y);
    this.pixi.start();

    super.start();
  }

  stop(): void {
    this.pixi.stop?.();

    super.stop();
  }

  destroy(): void {
    super.destroy();
    this.pixi.stage.removeChild(this);
  }

  enableAutoSort(): void {
    this.update$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.children.sort(
        (a: PIXIDisplayObject, b: PIXIDisplayObject) => a.y - b.y
      );
    });
  }
}
